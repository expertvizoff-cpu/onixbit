#!/usr/bin/env python3
"""GET-only publication check for accepted Onixbit RC 0f191e5.

Run before activation against the private container and after activation against
https://onixbit.ru. This self-contained stdlib probe verifies HTTP responses only;
archive extraction, container ABI, protected preview identities and browser/CRM
verification remain separate release gates. No redirects, proxies or submissions.
The immutable manifest and exact page metadata are pinned to the accepted RC.

Example (private upstream):
  python3 http-probe.py --internal --base http://172.18.0.5:3000 \
    --manifest runtime-manifest.json --report private-http.json
Example (public, only when authorized):
  python3 http-probe.py --public --base https://onixbit.ru \
    --manifest runtime-manifest.json --report public-http.json
A report must be a new JSON file with an existing parent. Without --report, the
complete JSON result goes to stdout. Exit 0 means PASS; any failed gate exits 1.
"""
from __future__ import annotations

import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import hashlib
from html.parser import HTMLParser
import ipaddress
import json
from pathlib import Path, PurePosixPath
import re
import stat
import struct
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode, urlsplit
from urllib.request import HTTPRedirectHandler, ProxyHandler, Request, build_opener
import xml.etree.ElementTree as ET

SOURCE_COMMIT = "0f191e579ed7c84d4719b29709809df80e4b05ae"
BUILD_ID = "ByEtc-a5cjdzPGuFkGEyN"
MANIFEST_SHA256 = "ccf7232ca0d205b8b0743896b6c741ded2c24a113432c4120b0a118d1a68c789"
IMAGE_PATH = "/media/relay/onixbit-founder.webp"
MAX_BODY = 16 * 1024 ** 2
MAX_MANIFEST = 32 * 1024 ** 2
# Metadata from accepted .next/server/app HTML; /articles is SSR, with metadata
# from its pinned source and the layout title template. This is the exact route
# set, not a sitemap page-count heuristic. Future RCs need a newly reviewed pin.
EXPECTED_PAGES = {
    "/": {
        "title": "Ониксбит: Битрикс24, сайты на 1С-Битрикс и интеграции с 1С",
        "description": "Разработка, внедрение и интеграции для B2B. Помогаем связать CRM, сайт и учёт в 1С. Публичные проекты, понятные этапы и прямой контакт с командой.",
        "canonical": "https://onixbit.ru"
    },
    "/articles": {
        "title": "Карта проблем Битрикс24, CRM, сайта и 1С | Ониксбит",
        "description": "База знаний Ониксбит как карта рабочих проблем: заявки с сайта, CRM, задачи, роботы, права, 1С и интеграции. Симптомы, проверки и полевые записки интегратора.",
        "canonical": "https://onixbit.ru/articles"
    },
    "/articles/lidy-sdelki-kontakty-kompanii-bitrix24": {
        "title": "Лид, сделка, контакт и компания в Битрикс24: разница | Ониксбит",
        "description": "Разбираем лиды, сделки, контакты и компании в Битрикс24: что где хранить, как принимать заявки и какие ошибки ломают CRM-отчёты.",
        "canonical": "https://onixbit.ru/articles/lidy-sdelki-kontakty-kompanii-bitrix24"
    },
    "/articles/menedzher-ne-vidit-sdelku-bitrix24": {
        "title": "Менеджер не видит сделку в Битрикс24: причины | Ониксбит",
        "description": "Почему в Битрикс24 не видно сделку: фильтры, воронки, права доступа, ответственный, стадии и дубли. Чек-лист администратора CRM.",
        "canonical": "https://onixbit.ru/articles/menedzher-ne-vidit-sdelku-bitrix24"
    },
    "/articles/obrabotat-zayavku-s-saita-v-bitrix24": {
        "title": "Как обработать заявку с сайта в Битрикс24 | Ониксбит",
        "description": "Пошагово: как принять заявку с сайта в Битрикс24, проверить источник, ответственного, контакт, сделку, задачу и не потерять клиента.",
        "canonical": "https://onixbit.ru/articles/obrabotat-zayavku-s-saita-v-bitrix24"
    },
    "/articles/poverhnostnoe-vnedrenie-bitrix24": {
        "title": "Как понять, что Битрикс24 внедрён поверхностно | Ониксбит",
        "description": "7 проверок для руководителя: заявки, сделки, задачи, коммуникации, роботы и отчёты в Битрикс24. Как отличить рабочую CRM от витрины настроек.",
        "canonical": "https://onixbit.ru/articles/poverhnostnoe-vnedrenie-bitrix24"
    },
    "/articles/roboty-v-sdelkah-bitrix24": {
        "title": "Роботы в сделках Битрикс24: примеры и ошибки | Ониксбит",
        "description": "Где роботы в сделках Битрикс24 помогают: задачи, письма, уведомления, контроль сроков. Какие сценарии лучше не автоматизировать вслепую.",
        "canonical": "https://onixbit.ru/articles/roboty-v-sdelkah-bitrix24"
    },
    "/articles/sait-crm-1c-istochnik-istiny": {
        "title": "Сайт, Битрикс24 и 1С: источник истины для данных | Ониксбит",
        "description": "Как распределить данные между сайтом, CRM и 1С: заявки, клиенты, товары, остатки, цены, заказы, статусы и тесты интеграции.",
        "canonical": "https://onixbit.ru/articles/sait-crm-1c-istochnik-istiny"
    },
    "/articles/sozdat-zadachu-i-otvetstvennost-bitrix24": {
        "title": "Как создать задачу в Битрикс24: ответственность и срок | Ониксбит",
        "description": "Пошагово: как создать задачу в Битрикс24, назначить ответственного, срок, чек-лист, наблюдателей и связать задачу с CRM.",
        "canonical": "https://onixbit.ru/articles/sozdat-zadachu-i-otvetstvennost-bitrix24"
    },
    "/cases": {
        "title": "Проекты Ониксбит — сайты на 1С-Битрикс и интеграции | Ониксбит",
        "description": "Великие Луки банк, Linnimax-shop и Ceresit-market: опубликованные проекты Ониксбит с описанием работ и ссылками на каталог 1С-Битрикс.",
        "canonical": "https://onixbit.ru/cases"
    },
    "/cases/ceresit-market": {
        "title": "Ceresit-market — проект Ониксбит | Ониксбит",
        "description": "Развитие существующего сайта: инфраструктура, исправления, каталог и обмен с 1С.",
        "canonical": "https://onixbit.ru/cases/ceresit-market"
    },
    "/cases/linnimax-shop": {
        "title": "Linnimax-shop — проект Ониксбит | Ониксбит",
        "description": "Интернет-магазин продукции Linnimax с обменом товарами, наличием и ценами из 1С:Управление торговлей.",
        "canonical": "https://onixbit.ru/cases/linnimax-shop"
    },
    "/cases/velikie-luki-bank": {
        "title": "Великие Луки банк — проект Ониксбит | Ониксбит",
        "description": "Перенос контента корпоративного сайта на 1С-Битрикс с использованием готового решения.",
        "canonical": "https://onixbit.ru/cases/velikie-luki-bank"
    },
    "/certificates": {
        "title": "Сертификаты: Битрикс24, 1С-Битрикс, 1С и партнёры | Ониксбит",
        "description": "Партнёрские статусы, компетенции и сертификаты обучения Ониксбит по Битрикс24, 1С-Битрикс, 1С, мессенджерам, сайтам и интеграциям.",
        "canonical": "https://onixbit.ru/certificates"
    },
    "/contacts": {
        "title": "Контакты Ониксбит: телефон, email, адреса и реквизиты | Ониксбит",
        "description": "Контакты Ониксбит для заявок по Битрикс24, 1С-Битрикс, 1С и интеграциям: телефон, email, мессенджеры, адрес в Туле, почтовый адрес в Кимовске, реквизиты и форма заявки.",
        "canonical": "https://onixbit.ru/contacts"
    },
    "/integracii": {
        "title": "Интеграция сайта, Битрикс24 и 1С | Ониксбит",
        "description": "Связываем сайт, Битрикс24 и 1С: заявки, заказы, цены и остатки проходят между системами по согласованным правилам. Диагностика обменов и контроль ошибок.",
        "canonical": "https://onixbit.ru/integracii"
    },
    "/o-kompanii": {
        "title": "О компании Ониксбит: основатель, подход, сертификаты и B2B-интеграции | Ониксбит",
        "description": "Ониксбит — B2B-интегратор по Битрикс24, 1С-Битрикс и интеграциям с 1С. Александр Тужилкин, 14 лет опыта, партнёрские статусы, Тула и удалённая работа по России.",
        "canonical": "https://onixbit.ru/o-kompanii"
    },
    "/privacy": {
        "title": "Политика конфиденциальности Ониксбит | Ониксбит",
        "description": "Политика конфиденциальности Ониксбит: обработка персональных данных, формы Битрикс24, cookies, аналитика, внешние сервисы и права пользователя.",
        "canonical": "https://onixbit.ru/privacy"
    },
    "/raboty-po-1c-predpriyatie": {
        "title": "Интеграции 1С с Битрикс24 и сайтами на 1С-Битрикс | Ониксбит",
        "description": "Ониксбит помогает связать 1С:Предприятие с Битрикс24 и сайтами на 1С-Битрикс: заказы, остатки, цены, статусы, обмены и контроль ошибок.",
        "canonical": "https://onixbit.ru/raboty-po-1c-predpriyatie"
    },
    "/razrabotka-saitov-na-1c-bitrix": {
        "title": "Разработка сайтов на 1С-Битрикс с CRM и 1С-интеграциями | Ониксбит",
        "description": "Ониксбит проектирует корпоративные сайты, каталоги и интернет-магазины на 1С-Битрикс: структура, формы, SEO-основа, CRM, 1С и поддержка развития.",
        "canonical": "https://onixbit.ru/razrabotka-saitov-na-1c-bitrix"
    },
    "/tarify-licenziy": {
        "title": "Тарифы Битрикс24: облако, коробка, лицензии и подбор | Ониксбит",
        "description": "Ониксбит помогает подобрать тарифы Битрикс24: облако, коробка, пользователи, права, диск, интеграции, Маркетплейс, BitrixGPT и счёт для B2B-компании.",
        "canonical": "https://onixbit.ru/tarify-licenziy"
    },
    "/uslugi": {
        "title": "Услуги: Битрикс24, сайты и интеграции с 1С | Ониксбит",
        "description": "Выберите направление работ Ониксбит: внедрение CRM, разработка сайта на 1С-Битрикс, обмены с 1С, поддержка и лицензии.",
        "canonical": "https://onixbit.ru/uslugi"
    },
    "/vnedrenie-bitrix24": {
        "title": "Внедрение Битрикс24 под продажи, процессы и интеграции | Ониксбит",
        "description": "Ониксбит внедряет Битрикс24: CRM, воронки, роботы, права, отчёты, коммуникации, интеграции с сайтом, 1С и поддержка запуска.",
        "canonical": "https://onixbit.ru/vnedrenie-bitrix24"
    }
}

class ProbeError(Exception):
    """Bounded codes only; response bodies and exception messages are not logged."""
    def __init__(self, code, item=None):
        self.code = code
        self.item = hashlib.sha256(str(item).encode()).hexdigest()[:16] if item is not None else None
        super().__init__(code)


def require(condition, code, item=None):
    if not condition:
        raise ProbeError(code, item)


def sha256(body):
    return hashlib.sha256(body).hexdigest()


def read_manifest(path, expected_build_id):
    require(path.is_file() and not path.is_symlink(), "MANIFEST_NOT_REGULAR_FILE")
    require(stat.S_ISREG(path.stat().st_mode) and path.stat().st_size <= MAX_MANIFEST, "MANIFEST_TOO_LARGE_OR_SPECIAL")
    raw = path.read_bytes()
    require(sha256(raw) == MANIFEST_SHA256, "PINNED_MANIFEST_SHA_MISMATCH")
    try:
        data = json.loads(raw)
    except (ValueError, UnicodeError):
        raise ProbeError("INVALID_MANIFEST_JSON") from None
    require(isinstance(data, dict) and type(data.get("schemaVersion")) is int and data["schemaVersion"] == 1, "MANIFEST_SCHEMA")
    require(data.get("sourceCommit") == SOURCE_COMMIT and data.get("buildId") == expected_build_id == BUILD_ID, "MANIFEST_IDENTITY_MISMATCH")
    require(data.get("platform") == "linux" and data.get("architecture") == "x64" and re.fullmatch(r"v22\.\d+\.\d+", str(data.get("nodeVersion"))), "MANIFEST_RUNTIME_MISMATCH")
    require(isinstance(data.get("files"), list) and len(data["files"]) == 1894, "MANIFEST_FILE_COUNT_MISMATCH")
    files = {}
    for item in data["files"]:
        require(isinstance(item, dict) and set(item) == {"path", "bytes", "sha256"}, "MANIFEST_FILE_FIELDS")
        path = item["path"]
        require(isinstance(path, str) and 0 < len(path) <= 4096 and "\\" not in path and not any(ord(c) < 32 or ord(c) == 127 for c in path), "MANIFEST_PATH_INVALID")
        require(not path.startswith("/") and not re.match(r"^[A-Za-z]:", path) and not any(part in ("", ".", "..") for part in path.split("/")), "MANIFEST_PATH_UNSAFE")
        require(PurePosixPath(path).parts[0] in {"server.js", "package.json", "node_modules", ".next", "public"} and path not in files, "MANIFEST_PATH_DUPLICATE_OR_UNKNOWN")
        require(type(item["bytes"]) is int and 0 <= item["bytes"] <= 2 * 1024 ** 3, "MANIFEST_FILE_SIZE_INVALID", path)
        require(isinstance(item["sha256"], str) and re.fullmatch(r"[a-f0-9]{64}", item["sha256"]), "MANIFEST_FILE_HASH_INVALID", path)
        files[path] = {"bytes": item["bytes"], "sha256": item["sha256"]}
    assets = {path: info for path, info in files.items() if path.startswith(("public/", ".next/static/"))}
    require(len(assets) == 185, "PUBLIC_STATIC_EXACT_COUNT_MISMATCH")
    require(all(info["bytes"] <= MAX_BODY for info in assets.values()), "ASSET_EXCEEDS_HTTP_BODY_LIMIT")
    build_files = {f".next/static/{expected_build_id}/{name}" for name in ("_buildManifest.js", "_clientMiddlewareManifest.js", "_ssgManifest.js")}
    require(build_files <= assets.keys() and {"server.js", "package.json", ".next/BUILD_ID"} <= files.keys(), "NEXT_BUILD_ID_FILES_MISSING")
    return assets, sorted(build_files)


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, request, response, code, message, headers, url):
        return None


class PublicationHTTP:
    def __init__(self, base, internal, timeout):
        require(isinstance(base, str) and not any(ord(c) < 33 or ord(c) == 127 for c in base), "INVALID_BASE")
        try:
            value = urlsplit(base)
            port = value.port
        except ValueError:
            raise ProbeError("INVALID_BASE") from None
        require(value.username is None and value.password is None and value.path in ("", "/") and not value.query and not value.fragment, "BASE_MUST_BE_ORIGIN")
        if internal:
            require(value.scheme == "http" and port is not None and 1 <= port <= 65535, "INTERNAL_HTTP_EXPLICIT_PORT_REQUIRED")
            host = value.hostname
            if host == "localhost":
                host = "127.0.0.1"  # No DNS resolution or inherited proxy route.
            try:
                address = ipaddress.ip_address(host or "")
            except ValueError:
                raise ProbeError("INTERNAL_LITERAL_ADDRESS_REQUIRED") from None
            networks = ("10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16", "127.0.0.0/8", "::1/128", "fc00::/7")
            require("%" not in host and any(address in ipaddress.ip_network(net) for net in networks), "INTERNAL_PRIVATE_OR_LOOPBACK_REQUIRED")
            host = f"[{address}]" if address.version == 6 else str(address)
            self.base = f"http://{host}:{port}"
        else:
            require(base in ("https://onixbit.ru", "https://onixbit.ru/"), "PUBLIC_EXACT_ONIXBIT_HTTPS_REQUIRED")
            self.base = "https://onixbit.ru"
        self.timeout = timeout

    def get(self, path, expected=200, accept=None, max_bytes=MAX_BODY):
        require(path.startswith("/") and not path.startswith("//") and "#" not in path and not any(ord(c) < 32 or ord(c) == 127 for c in path), "INVALID_GET_PATH")
        require(type(max_bytes) is int and 0 <= max_bytes <= MAX_BODY, "INVALID_BODY_LIMIT")
        headers = {"User-Agent": "Onixbit-publication-http-probe/1.0", "Accept-Encoding": "identity"}
        if accept:
            headers["Accept"] = accept
        opener = build_opener(ProxyHandler({}), NoRedirect())
        url = self.base + path
        try:
            try:
                response = opener.open(Request(url, headers=headers, method="GET"), timeout=self.timeout)
            except HTTPError as error:
                response = error
            with response:
                require(response.headers.get("Location") is None and not 300 <= response.status < 400, "HTTP_REDIRECT_REJECTED", path)
                require(response.status == expected, "HTTP_STATUS_MISMATCH", path)
                require(response.geturl() == url, "HTTP_URL_CHANGED", path)
                require(response.headers.get("Content-Encoding", "identity").lower() == "identity", "HTTP_UNEXPECTED_CONTENT_ENCODING", path)
                body = response.read(max_bytes + 1)
                require(len(body) <= max_bytes, "HTTP_BODY_TOO_LARGE", path)
                return body, response.headers
        except (URLError, TimeoutError, OSError):
            raise ProbeError("HTTP_UNAVAILABLE", path) from None


class HTMLFacts(HTMLParser):
    def __init__(self):
        super().__init__()
        self.h1 = 0
        self.canonical = []
        self.robots = []
        self.titles = []
        self.descriptions = []
        self.static_refs = []
        self.in_title = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "h1":
            self.h1 += 1
        if tag == "title":
            self.titles.append("")
            self.in_title = True
        if tag == "link" and "canonical" in attrs.get("rel", "").lower().split():
            self.canonical.append(attrs.get("href"))
        if tag == "meta":
            name = attrs.get("name", "").lower()
            if name in ("robots", "googlebot", "bingbot"):
                self.robots.append(attrs.get("content", ""))
            if name == "description":
                self.descriptions.append(attrs.get("content"))
        ref = attrs.get("src") if tag == "script" else attrs.get("href") if tag == "link" else None
        if isinstance(ref, str) and "_next/static/" in ref:
            self.static_refs.append(ref)

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

    def handle_data(self, value):
        if self.in_title:
            self.titles[-1] += value


def html_facts(body, route):
    facts = HTMLFacts()
    try:
        facts.feed(body.decode("utf-8"))
        facts.close()
    except (UnicodeError, ValueError):
        raise ProbeError("PAGE_ENCODING_OR_HTML_INVALID", route) from None
    return facts


def noindex(facts, headers):
    return any("noindex" in value.lower() or re.search(r"(?:^|[\s,:])none(?:$|[\s,;])", value.lower()) for value in facts.robots + headers.get_all("X-Robots-Tag", []))


def asset_url(path):
    url = "/" + path[len("public/"):] if path.startswith("public/") else "/_next/static/" + path[len(".next/static/"):]
    # Match JS encodeURIComponent per segment. Literal () is significant in Next
    # public lookup; default urllib quoting would encode it and can produce 404.
    return quote(url, safe="/!~*'()")


def image_dimensions(body):
    if body.startswith(b"\x89PNG\r\n\x1a\n") and len(body) >= 24:
        return struct.unpack(">II", body[16:24])
    if body.startswith(b"RIFF") and body[8:12] == b"WEBP" and len(body) >= 30:
        kind = body[12:16]
        if kind == b"VP8X":
            return (int.from_bytes(body[24:27], "little") + 1, int.from_bytes(body[27:30], "little") + 1)
        if kind == b"VP8 " and body[23:26] == b"\x9d\x01\x2a":
            width, height = struct.unpack("<HH", body[26:30])
            return width & 0x3FFF, height & 0x3FFF
        if kind == b"VP8L" and body[20] == 0x2F:
            packed = int.from_bytes(body[21:25], "little")
            return (packed & 0x3FFF) + 1, ((packed >> 14) & 0x3FFF) + 1
    if body.startswith(b"\xff\xd8"):
        cursor = 2
        while cursor + 9 <= len(body):
            if body[cursor] != 0xFF:
                cursor += 1
                continue
            marker = body[cursor + 1]
            cursor += 2
            if marker in (0xD8, 0xD9) or 0xD0 <= marker <= 0xD7:
                continue
            if cursor + 2 > len(body):
                break
            length = int.from_bytes(body[cursor:cursor + 2], "big")
            if marker in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
                return (int.from_bytes(body[cursor + 5:cursor + 7], "big"), int.from_bytes(body[cursor + 3:cursor + 5], "big"))
            if length < 2:
                break
            cursor += length
    raise ProbeError("IMAGE_DIMENSIONS_UNSUPPORTED_OR_INVALID")


def check_http(client, assets, build_files):
    sitemap_body, headers = client.get("/sitemap.xml")
    require(headers.get_content_type() in ("application/xml", "text/xml"), "SITEMAP_MIME_MISMATCH")
    try:
        xml = ET.fromstring(sitemap_body)
    except ET.ParseError:
        raise ProbeError("SITEMAP_XML_INVALID") from None
    ns = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
    require(xml.tag == ns + "urlset", "SITEMAP_ROOT_MISMATCH")
    urls = xml.findall(ns + "url")
    require(len(urls) == 23 and all(len(item.findall(ns + "loc")) == 1 for item in urls), "SITEMAP_URL_STRUCTURE_MISMATCH")
    locations = [item.find(ns + "loc").text for item in urls]
    expected_locations = {"https://onixbit.ru" + route for route in EXPECTED_PAGES}
    require(len(locations) == 23 and len(set(locations)) == 23 and set(locations) == expected_locations, "SITEMAP_EXACT_ROUTE_SET_MISMATCH")
    next_urls = {asset_url(path) for path in assets if path.startswith(".next/static/")}
    pages = []
    for route, metadata in sorted(EXPECTED_PAGES.items()):
        body, headers = client.get(quote(route, safe="/!~*'()"))
        require(headers.get_content_type() == "text/html", "PAGE_MIME_MISMATCH", route)
        facts = html_facts(body, route)
        require(facts.h1 == 1, "PAGE_H1_MISMATCH", route)
        require(facts.canonical == [metadata["canonical"]], "PAGE_EXACT_CANONICAL_MISMATCH", route)
        require(facts.titles == [metadata["title"]], "PAGE_EXACT_TITLE_MISMATCH", route)
        require(facts.descriptions == [metadata["description"]], "PAGE_EXACT_DESCRIPTION_MISMATCH", route)
        require(not noindex(facts, headers), "PUBLIC_ROUTE_NOINDEX", route)
        require(bool(facts.static_refs) and all(ref in next_urls for ref in facts.static_refs), "PAGE_STATIC_REFERENCE_NOT_MANIFESTED", route)
        pages.append({"path": route, "status": 200, "h1": 1, "canonical": metadata["canonical"], "metadata": "PASS", "indexability": "PASS", "staticReferences": "PASS"})
    robots_body, headers = client.get("/robots.txt")
    require(headers.get_content_type() == "text/plain", "ROBOTS_MIME_MISMATCH")
    try:
        robots = robots_body.decode("utf-8")
    except UnicodeError:
        raise ProbeError("ROBOTS_ENCODING_MISMATCH") from None
    require(re.search(r"(?im)^Sitemap:\s*https://onixbit\.ru/sitemap\.xml\s*$", robots) and not re.search(r"(?im)^Disallow:\s*/\s*$", robots), "ROBOTS_POLICY_MISMATCH")
    body, headers = client.get("/full-site-publication-probe-does-not-exist", expected=404)
    require(headers.get_content_type() == "text/html", "NOT_FOUND_MIME_MISMATCH")
    facts = html_facts(body, "/full-site-publication-probe-does-not-exist")
    require(facts.h1 == 1 and noindex(facts, headers), "NOT_FOUND_H1_OR_NOINDEX_MISMATCH")
    health = []
    for _ in range(3):
        body, headers = client.get("/api/health", max_bytes=4096)
        require(headers.get_content_type() == "application/json", "HEALTH_MIME_MISMATCH")
        try:
            data = json.loads(body)
        except (ValueError, UnicodeError):
            raise ProbeError("HEALTH_JSON_INVALID") from None
        require(isinstance(data, dict) and set(data) == {"ok", "service"} and data["ok"] is True and data["service"] == "onixbit", "HEALTH_STRICT_CONTRACT_MISMATCH")
        health.append({"status": 200, "contract": "PASS"})

    def verify_asset(item):
        path, expected = item
        body, headers = client.get(asset_url(path), max_bytes=expected["bytes"])
        actual = {"bytes": len(body), "sha256": sha256(body)}
        require(actual == expected, "HTTP_ASSET_HASH_OR_SIZE_MISMATCH", path)
        return {"path": path, **actual, "contentType": headers.get("Content-Type"), "status": "PASS"}

    with ThreadPoolExecutor(max_workers=4) as executor:
        results = list(executor.map(verify_asset, sorted(assets.items())))
    require("public" + IMAGE_PATH in assets, "RESIZE_SOURCE_NOT_MANIFESTED")
    resize_url = "/_next/image?" + urlencode({"url": IMAGE_PATH, "w": 640, "q": 75})
    body, headers = client.get(resize_url, accept="image/webp")
    require(headers.get_content_type().startswith("image/"), "IMAGE_RESIZE_MIME_MISMATCH")
    width, height = image_dimensions(body)
    require((width, height) == (640, 360), "IMAGE_RESIZE_EXACT_DIMENSIONS_MISMATCH")
    require(sha256(body) != assets["public" + IMAGE_PATH]["sha256"], "IMAGE_RESIZE_RETURNED_SOURCE_BYTES")
    return {"sitemap": "PASS", "pages": pages, "robots": "PASS", "notFound": {"status": 404, "h1": 1, "noindex": "PASS"}, "health": health, "publicAndNextStaticAssets": results, "nextBuildIdAssets": {"buildId": BUILD_ID, "paths": build_files, "status": "PASS"}, "resizedImage": {"path": IMAGE_PATH, "width": width, "height": height, "bytes": len(body), "sha256": sha256(body), "contentType": headers.get("Content-Type"), "status": "PASS"}}


def report_target(value):
    path = Path(value).absolute()
    require(path.suffix == ".json" and path.parent.is_dir() and not path.exists() and not path.is_symlink(), "REPORT_MUST_BE_NEW_JSON_WITH_EXISTING_PARENT")
    require(not any(parent.is_symlink() for parent in path.parents), "REPORT_PARENT_SYMLINK_REJECTED")
    return path


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--internal", action="store_true", help="HTTP literal private/loopback origin with explicit port")
    mode.add_argument("--public", action="store_true", help="Only exact https://onixbit.ru")
    parser.add_argument("--base", required=True)
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--report", help="New JSON file; omitted means full report on stdout")
    parser.add_argument("--expected-build-id", default=BUILD_ID, help="Pinned accepted RC BUILD_ID (cannot select an unreviewed release)")
    parser.add_argument("--timeout", type=int, default=30)
    args = parser.parse_args()
    report = {"schemaVersion": 1, "checkedAt": datetime.now(timezone.utc).isoformat(), "status": "RUNNING", "scope": "GET-only publication HTTP; no redirects/proxies/browser/CRM/deployment", "checks": {}}
    target = None
    try:
        require(args.expected_build_id == BUILD_ID, "UNREVIEWED_BUILD_ID")
        require(1 <= args.timeout <= 120, "HTTP_TIMEOUT_OUT_OF_BOUNDS")
        client = PublicationHTTP(args.base, args.internal, args.timeout)
        if args.report:
            target = report_target(args.report)
        assets, build_files = read_manifest(args.manifest, args.expected_build_id)
        report["identity"] = {"sourceCommit": SOURCE_COMMIT, "buildId": BUILD_ID, "runtimeManifestSHA256": MANIFEST_SHA256, "mode": "internal" if args.internal else "public", "base": client.base}
        report["checks"]["http"] = check_http(client, assets, build_files)
        report["status"] = "PASS"
    except ProbeError as error:
        report["status"] = "FAIL"
        report["failure"] = {"code": error.code, "itemFingerprint": error.item}
    except Exception as error:
        report["status"] = "FAIL"
        report["failure"] = {"code": "UNEXPECTED_PROBE_ERROR", "type": type(error).__name__}
    if target:
        try:
            with target.open("x", encoding="utf-8") as output:
                output.write(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
        except OSError:
            report["status"] = "FAIL"
            report["failure"] = {"code": "REPORT_WRITE_REJECTED"}
        print(json.dumps({"status": report["status"], "report": str(target), "failureCode": report.get("failure", {}).get("code")}, ensure_ascii=False))
    else:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0 if report["status"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
