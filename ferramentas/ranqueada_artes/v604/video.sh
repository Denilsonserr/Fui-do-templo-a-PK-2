# v604: menu ALUCARD (vídeo do dono 1408x640, 6 s): emenda sem pulo no loop, sem som, webm vp9 + mp4 + poster
set -e;cd "$(dirname "$0")";F="[0:v]split[a][b];[a]trim=0.7:6.04,setpts=PTS-STARTPTS[a1];[b]trim=0:0.7,setpts=PTS-STARTPTS[b1];[a1][b1]xfade=transition=fade:duration=0.7:offset=4.64,fps=24,format=yuv420p[x]"
ffmpeg -v error -y -i menu_alucard_original.mp4 -filter_complex "$F" -map "[x]" -an -c:v libvpx-vp9 -b:v 0 -crf 42 -row-mt 1 -deadline good -cpu-used 4 out.webm
ffmpeg -v error -y -i menu_alucard_original.mp4 -filter_complex "$F" -map "[x]" -an -c:v libx264 -preset veryfast -crf 25 -pix_fmt yuv420p -movflags +faststart out.mp4
ffmpeg -v error -y -ss 0.5 -i out.mp4 -frames:v 1 -c:v libwebp -quality 82 out_poster.webp
ls -la out.*
