"""Optional vocabulary audit against the current official Schema.org JSON-LD.
Network and Python standard library only. Does not assert Google rich-result eligibility.
"""
import json
import re
import urllib.request
from pathlib import Path

root = Path(__file__).resolve().parent.parent
vocabulary = json.load(urllib.request.urlopen('https://schema.org/version/latest/schemaorg-current-https.jsonld', timeout=30))
terms = {n['@id']: n for n in vocabulary['@graph']}

def ids(value):
    return [v['@id'] for v in (value if isinstance(value, list) else [value]) if isinstance(v, dict) and '@id' in v]

def ancestors(type_id, seen=None):
    seen = set() if seen is None else seen
    if type_id in seen:
        return seen
    seen.add(type_id)
    for parent in ids(terms[type_id].get('rdfs:subClassOf', [])):
        ancestors(parent, seen)
    return seen

count = 0
for route in ['', 'abrek', 'ru', 'ru/abrek', 'tr', 'tr/abrek']:
    text = (root / route / 'index.html').read_text(encoding='utf-8')
    data = json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>', text, re.S).group(1))
    entities = {n['@id']: n for n in data['@graph'] if '@id' in n}

    def check(node):
        global count
        if isinstance(node, list):
            for child in node:
                check(child)
            return
        if not isinstance(node, dict):
            return
        if '@type' in node:
            type_id = 'schema:' + node['@type']
            assert type_id in terms, type_id
            parent_types = ancestors(type_id)
            for key, value in node.items():
                if key.startswith('@'):
                    continue
                prop = terms.get('schema:' + key)
                assert prop, f'Unknown property: {key}'
                allowed = set(ids(prop.get('schema:domainIncludes', [])))
                assert not allowed or allowed & parent_types, f'{key} not applicable to {type_id}'
                ranges = set(ids(prop.get('schema:rangeIncludes', [])))
                for v in value if isinstance(value, list) else [value]:
                    if isinstance(v, dict):
                        target = entities.get(v.get('@id'), v)
                        if '@type' in target:
                            assert ranges & ancestors('schema:' + target['@type']), f'{key}: incorrect referenced type'
                count += 1
        for key, child in node.items():
            if key != '@context':
                check(child)

    check(data)
print(f'PASS: six pages; {count} properties checked against official Schema.org types, inheritance, domains and typed references.')
