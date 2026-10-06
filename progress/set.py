#!/usr/bin/env python3
"""usage: set.py <piece> <attempt> <status> [gap] ; then --now/--updated via env NOW, UPDATED; RESULT=won|kept|live"""
import json,pathlib,sys,os
p=pathlib.Path(__file__).parent/'progress.json';d=json.loads(p.read_text())
if len(sys.argv)>3:
    pid,n,st=sys.argv[1],int(sys.argv[2]),sys.argv[3]
    for x in d['pieces']:
        if x['id']==pid:
            a=[a for a in x['attempts'] if a['n']==n]
            if not a: a=[{'n':n}]; x['attempts'].append(a[0])
            a[0]['status']=st
            if len(sys.argv)>4 and sys.argv[4]: a[0]['gap']=sys.argv[4]
            if os.environ.get('NOTE'): a[0]['note']=os.environ['NOTE']
            r=os.environ.get('RESULT')
            if r: x['result']=r; x['resultLabel']={'won':'Picked blind','kept':'Best version kept','live':'In progress'}[r]
for k in ('NOW','UPDATED'):
    if os.environ.get(k): d[k.lower()]=os.environ[k]
p.write_text(json.dumps(d,indent=1))
import subprocess;subprocess.run([sys.executable,str(p.parent/'progress.py')])
