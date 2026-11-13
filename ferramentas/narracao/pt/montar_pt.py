# v388: narração em PORTUGUÊS do dono (ElevenLabs, 55 áudios sem nome) → identificados por reconhecimento de fala (Whisper small)
# e conferidos pela ordem em que foram gerados. Corta silêncio, iguala volume (-15 LUFS como o narrador inglês) → www/a/*.mp3 → RQA.vozpt
import json,hashlib,os,subprocess,glob,re,sys
R=os.path.dirname(os.path.abspath(__file__))+'/../../../';W=R+'www/';A=sys.argv[1]
M={'10_13_22':'vMChallenge','10_13_44':'vCOK','10_14_47':'vFirstAttack','10_15_22':'vImpressive','10_16_01':'vAmazing','10_10_29':'vAmazing~2',
 '10_16_20':'vFantastic','10_16_37':'vExtreme','10_16_55':'vReflected','10_17_10':'vPowerUp','10_11_35':'vMaxBurst','10_09_55':'vSuperPower',
 '10_17_34':'vUltimate','10_09_19':'vUltimate~2','10_18_12':'vRDestruction','10_18_30':'vESpecialFinish','10_18_47':'vEReverseSpecialFinish',
 '10_19_04':'vEDestructionFinish','10_19_20':'vESmashKO','10_19_36':'vEDevastation','10_20_29':'vEDoubleKO','10_20_47':'vEPerfect','10_10_45':'vEPerfect~2',
 '10_21_58':'vPlayer01','10_22_06':'vPlayer02','10_22_14':'vPlayer03','10_22_35':'vGameOver','10_23_35':'vCongratulations',
 '10_06_02':'nS1','10_07_52':'nR1','10_08_11':'nR2','10_08_31':'nRF','10_23_02':'xTempo','10_24_06':'xRecorde',
 '10_03_46':'xProv~1','10_04_18':'xProv~2','10_05_27':'xProv~3','10_10_17':'xProv~4','10_07_11':'xProv~5',
 '10_25_39':'nm_goku','10_25_55':'nm_vegeta','10_26_16':'nm_broly','10_26_32':'nm_naruto','10_26_59':'nm_madara','10_27_16':'nm_gojo',
 '10_27_29':'nm_rengoku','10_27_44':'nm_luffy','10_27_57':'nm_zoro','10_28_28':'nm_aokiji','10_28_46':'nm_garou','10_29_04':'nm_shaka',
 '10_29_23':'nm_qingqing','10_29_40':'nm_zaykon','10_29_53':'nm_zedry','10_30_10':'nm_aylla'}
OUT={}
for f in glob.glob(A+'/*ElevenLabs*.mp3'):
    t=re.search(r'T(10_\d\d_\d\d)',f).group(1)
    if t not in M:print('SEM USO',t);continue
    k=M[t];tmp='/tmp/_pt.mp3'
    subprocess.run(['ffmpeg','-v','error','-y','-i',f,'-af','silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.02,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.06,areverse,loudnorm=I=-15:TP=-1.5:LRA=11,aresample=44100','-ac','1','-b:a','96k',tmp],check=True)
    d=open(tmp,'rb').read();n='a/'+hashlib.md5(d).hexdigest()[:14]+'.mp3';open(W+n,'wb').write(d)
    base,_,v=k.partition('~');OUT.setdefault(base,[]).append(n)
J=R+'ferramentas/web/ranqueada/rk_assets.json';Aj=json.load(open(J));Aj['vozpt']=OUT;json.dump(Aj,open(J,'w'),ensure_ascii=False,separators=(',',':'))
print(len(OUT),sum(len(v) for v in OUT.values()))
