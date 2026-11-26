"""Build the static GitHub Pages entry points from _site_src with Python and lxml."""

import json
from copy import deepcopy
from pathlib import Path

from lxml import etree, html


ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "_site_src"
SECTIONS = {
    "experience": {"en": "jobs", "fr": "experience", "es": "experiencia"},
    "education": {"en": "education", "fr": "formation", "es": "formacion"},
    "skills": {"en": "skills", "fr": "competences", "es": "competencias"},
    "projects": {"en": "projects", "fr": "projets", "es": "proyectos"},
    "certifications": {"en": "certifications", "fr": "certifications", "es": "certificaciones"},
    "languages": {"en": "languages", "fr": "langues", "es": "idiomas"},
}
LANGUAGES = ("en", "fr", "es")
DOMAIN = "https://" + (ROOT / "CNAME").read_text().strip()

def route(lang, section="about", project=None):
    path = f"/{lang}/"
    if section != "about":
        path += SECTIONS[section][lang] + "/"
    return path + project + "/" if project else path


def translate(element, strings):
    for key in ("aria-label", "title", "alt", "data-label", "placeholder"):
        if element.get(key) in strings:
            element.set(key, strings[element.get(key)])
    if "data-no-translate" in element.attrib:
        return

    def translated(text):
        if text and text.strip() in strings:
            return text.replace(text.strip(), strings[text.strip()], 1)
        return text

    element.text = translated(element.text)
    for child in element:
        if isinstance(child.tag, str):
            translate(child, strings)
        child.tail = translated(child.tail)


def menu_link(element, href, checked):
    element.tag = "a"
    element.attrib.pop("type", None)
    element.set("href", href)
    element.set("aria-checked", str(checked).lower())


def prepare_projects(projects, lang, project):
    cards = projects.xpath(".//article[@data-project-item]")
    selected = project or cards[0].get("data-project-item")
    for card in cards:
        if card.get("data-project-item") == selected:
            card.attrib.pop("hidden", None)
            current = card
        else:
            card.getparent().remove(card)

    if project:
        current.find(".//h3").tag = "h1"
    for link in projects.xpath(".//*[@data-project-choice]"):
        slug = link.get("data-project-choice")
        menu_link(link, route(lang, "projects", slug), slug == selected)
    return current


def add_fallback_navigation(page, main):
    fallback = etree.Element("noscript")
    main.insert(0, fallback)
    for menu in page.xpath("//*[@data-command-menu='navigation' or @data-command-menu='language' or @data-command-menu='links' or @data-project-picker-menu]"):
        nav = etree.SubElement(fallback, "nav", {"aria-label": menu.get("aria-label")})
        for item in menu.findall("a"):
            link = etree.SubElement(nav, "a", href=item.get("href"))
            link.text = item.xpath("./span[last()]")[0].text_content()
            link.tail = " · "
        nav[-1].tail = None


def build_page(template, lang, locale, section, project=None):
    page = deepcopy(template)
    page.set("lang", lang)
    main = page.get_element_by_id("main-content")
    for child in list(main):
        if child.get("id") != section:
            main.remove(child)
    if section == "projects":
        current = prepare_projects(main.get_element_by_id("projects"), lang, project)
    if not project:
        heading_area = page.get_element_by_id("profile") if section == "about" else main
        heading_area.find(".//h2").tag = "h1"
    for link in page.xpath("//*[@data-navigation-target]"):
        target = link.get("data-navigation-target")
        link.set("href", route(lang, target))
        if target == section:
            link.set("aria-current", "location" if project else "page")
            active_link = link
    page.find(".//a[@data-home-link]").set("href", route(lang))
    for link in page.xpath("//*[@data-language-choice]"):
        other = link.get("data-language-choice")
        menu_link(link, route(other, section, project), other == lang)
        link.set("lang", other)
        link.set("hreflang", other)
    translate(page.find("body"), locale["strings"])
    add_fallback_navigation(page, main)
    title = locale["title"]
    description = locale["description"]
    if project:
        title = current.find(".//h1").text_content() + " — Enzo de Matos"
        description = current.find(".//*[@class='project-alert']").text_content()
    elif section != "about":
        title = active_link.findall("span")[-1].text_content() + " — Enzo de Matos"
    head = page.find("head")
    head.find("title").text = title
    for attr, key, value in (("name", "description", description), ("property", "og:title", title),
                             ("property", "og:description", description)):
        head.find(f"meta[@{attr}='{key}']").set("content", value)
    url = DOMAIN + route(lang, section, project)
    etree.SubElement(head, "meta", property="og:url", content=url)
    etree.SubElement(head, "link", rel="canonical", href=url)
    for other in LANGUAGES:
        etree.SubElement(head, "link", rel="alternate", hreflang=other, href=DOMAIN + route(other, section, project))
    default = "/" if section == "about" else route("en", section, project)
    etree.SubElement(head, "link", rel="alternate", hreflang="x-default", href=DOMAIN + default)

    script = page.find("body/script[@src]")
    script.addprevious(html.Element("script", src=f"/{lang}/strings.js", defer="defer"))
    return html.tostring(page, encoding="unicode", doctype="<!doctype html>") + "\n"


def write(path, content):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8", newline="\n")


def build():
    template = html.fromstring((SOURCE / "portfolio.html").read_text(encoding="utf-8"))
    slugs = template.xpath("//article/@data-project-item")
    pages = [(section, None) for section in ("about", *SECTIONS)]
    pages.extend(("projects", slug) for slug in slugs)
    for lang in LANGUAGES:
        locale = json.loads((SOURCE / f"{lang}.json").read_text(encoding="utf-8"))
        strings = json.dumps(locale["strings"], ensure_ascii=False, indent=2)
        write(ROOT / lang / "strings.js", "const pageTranslations = " + strings + ";\n")
        for section, project in pages:
            content = build_page(template, lang, locale, section, project)
            write(ROOT / route(lang, section, project).strip("/") / "index.html", content)
            if lang == "en" and section == "about":
                write(ROOT / "index.html", content)


if __name__ == "__main__":
    build()
