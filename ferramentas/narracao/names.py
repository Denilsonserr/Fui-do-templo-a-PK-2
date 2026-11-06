import sys;sys.path.insert(0,'/home/claude/tts');from gen import say,VO
import subprocess
N={'denilson':'dɛnˈɪlsən!','arkarus':'ɑɹkˈɑɹəːs!','denilson2':'dɛnˈɪlsən tˈuː!','aylla':'ˈIlɑː!','white':'wˈIːt!','xiao':'ʃˈW wˈɪːn!','magmus':'ʤˈɛnəɹəl mˈæɡməːs!',
 'zaykon':'zˈAkɑːn!','zedry':'zˈɛdɹiː!','broly':'bɹˈOliː!','zoro':'zˈɔɹOː!','aokiji':'ˌWkˈiʤiː!','goku':'ɡˈOkuː!','vegeta':'vəʤˈitɑː!','gogeta':'ɡOɡˈɛtɑː!',
 'madara':'mədˈɑɹɑː!','gojo':'ɡˈOʤˈOː!','luffy':'lˈʌfiː!','rengoku':'ɹɛŋɡˈOkuː!','qingqing':'ʧˈɪŋʧˈɪːŋ!','linfeng':'lˈɪn fˈʌːŋ!'}
st=VO['am_fenrir']*.6+VO['am_eric']*.4
FX="rubberband=pitch=1.32:formant=preserved,highpass=f=90,equalizer=f=2800:t=q:w=1.2:g=5,acompressor=threshold=0.08:ratio=6:attack=3:release=120:makeup=3,aexciter=amount=2:drive=6,asoftclip=type=tanh,aecho=0.8:0.55:70|140:0.22|0.12,loudnorm=I=-15:TP=-1.5"
for k,ph in N.items():
    if len(sys.argv)>1 and k not in sys.argv[1:]:continue
    w=f'/home/claude/tts/out/{k}.wav';say(ph,st,0.82,w)
    subprocess.run(['ffmpeg','-loglevel','error','-y','-i',w,'-af',FX,'-ac','2','-ar','44100','-c:a','libmp3lame','-q:a','3',f'/home/claude/tts/out/n_{k}.mp3'],check=True)
print('ok')
