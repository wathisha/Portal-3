#!/usr/bin/env python3
"""
Sathsarani Science Academy LMS - Global Configuration Synchronization Script
Usage: python3 scripts/export_global_lms_files.py
This script updates assets/js/lms-core.js and assets/data/erp-config.json with desired global settings.
"""

import json
import os
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG_PATH = os.path.join(BASE_DIR, 'assets', 'data', 'erp-config.json')
LMS_CORE_PATH = os.path.join(BASE_DIR, 'assets', 'js', 'lms-core.js')

def sync_global_files():
    if not os.path.exists(CONFIG_PATH):
        print(f"Error: {CONFIG_PATH} not found!")
        return

    with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
        config = json.load(f)

    settings = config.get('settings', {})

    with open(LMS_CORE_PATH, 'r', encoding='utf-8') as f:
        js_code = f.read()

    settings_json = json.dumps(settings, indent=8)
    settings_replacement = f"const DEFAULT_SETTINGS = {settings_json.strip()};"
    js_code = re.sub(r'const DEFAULT_SETTINGS = \{[^;]*\};', settings_replacement, js_code)

    with open(LMS_CORE_PATH, 'w', encoding='utf-8') as f:
        f.write(js_code)

    print(f"Successfully synchronized global settings to {LMS_CORE_PATH}")

if __name__ == '__main__':
    sync_global_files()
