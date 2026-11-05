import json,numpy as np,onnxruntime as ort,sys
V=json.load(open('/home/claude/tts/src/src/kokoro_onnx/config.json'))['vocab']
S=ort.InferenceSession('/home/claude/tts/kokoro-v1.0.int8.onnx');VO=np.load('/home/claude/tts/voices-v1.0.bin')
ins={i.name:i for i in S.get_inputs()}
def say(ph,voice,speed,out):
    t=[V[c] for c in ph if c in V];miss=[c for c in ph if c not in V]
    if miss:print('MISS',miss,ph)
    v=VO[voice] if isinstance(voice,str) else voice;st=v[len(t)-1]
    tk='input_ids' if 'input_ids' in ins else 'tokens'
    a=S.run(None,{tk:np.array([[0,*t,0]],dtype=np.int64),'style':st.astype(np.float32),'speed':np.array([speed],dtype=np.float32 if 'float' in ins['speed'].type else np.int32)})[0].ravel()
    import wave;w=wave.open(out,"wb");w.setnchannels(1);w.setsampwidth(2);w.setframerate(24000);w.writeframes((np.clip(a,-1,1)*32767).astype(np.int16).tobytes());w.close()
if __name__=='__main__':
    for voice in sys.argv[1:]:
        say('mədˈɑɹə!',voice,0.85,f'/home/claude/tts/out/t_{voice}.wav')
