"""
utils/exporter.py
Phase 6 (cleaning happens upstream via validator/deduplicator) + Phase 7 (export).
Writes CSV, Excel, and confirms the SQLite master DB is up to date.
"""

import pandas as pd

import config
from utils.logger import get_logger
from utils.deduplicator import dedup_records

logger = get_logger("exporter")


def export_all(db):
    discovered = db.get_all_discovered_urls()
    websites = db.get_all_websites()
    contacts = db.get_all_contacts()

    # Phase 6: final dedup pass (belt-and-suspenders on top of DB UNIQUE constraints)
    discovered = dedup_records(discovered, "profile_url")
    websites = dedup_records(websites, "canonical_url")
    contacts = dedup_records(contacts, ["website", "detail_page_url"])

    df_discovered = pd.DataFrame(discovered)
    df_websites = pd.DataFrame(websites)
    df_contacts = pd.DataFrame(contacts)

    if not df_contacts.empty and "emails" in df_contacts.columns:
        df_contacts["emails"] = df_contacts["emails"].apply(
            lambda x: x.split(", ") if isinstance(x, str) and x else [""]
        )
        df_contacts = df_contacts.explode("emails").reset_index(drop=True)
        df_contacts = df_contacts.rename(columns={"emails": "email"})

    df_discovered.to_csv(config.CSV_DISCOVERED_URLS, index=False)
    df_websites.to_csv(config.CSV_WEBSITES, index=False)
    df_contacts.to_csv(config.CSV_CONTACTS, index=False)

    with pd.ExcelWriter(config.XLSX_MASTER, engine="openpyxl") as writer:
        if not df_contacts.empty:
            df_contacts.to_excel(writer, sheet_name="Contacts (Master)", index=False)
        if not df_websites.empty:
            df_websites.to_excel(writer, sheet_name="Websites", index=False)
        if not df_discovered.empty:
            df_discovered.to_excel(writer, sheet_name="Discovered URLs", index=False)

    logger.info(
        f"Exported {len(df_discovered)} discovered URLs, {len(df_websites)} websites, "
        f"{len(df_contacts)} contact records -> {config.OUTPUT_DIR}/"
    )
