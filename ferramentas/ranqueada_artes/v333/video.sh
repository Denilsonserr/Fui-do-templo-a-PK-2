# v333: vídeo do menu com botão PVP: remendo (sem nome/foto gravados) + emenda sem pulo no loop (fim cruzado com o começo), sem som
set -e;cd "$(dirname "$0")";F="[0:v]split[a][b];[a]trim=0.8:10.04,setpts=PTS-STARTPTS[a1];[b]trim=0:0.8,setpts=PTS-STARTPTS[b1];[a1][b1]xfade=transition=fade:duration=0.8:offset=8.44,format=yuv420p[x];[x][1:v]overlay=0:0"
ffmpeg -v error -y -i menu_pvp_original.mp4 -i remendo.png -filter_complex "$F" -an -c:v libvpx-vp9 -b:v 0 -crf 42 -row-mt 1 -deadline good -cpu-used 4 out.webm
ffmpeg -v error -y -i menu_pvp_original.mp4 -i remendo.png -filter_complex "$F" -an -c:v libx264 -preset veryfast -crf 24 -pix_fmt yuv420p -movflags +faststart out.mp4
ffmpeg -v error -y -ss 0.5 -i out.mp4 -frames:v 1 -c:v libwebp -quality 82 out_poster.webp
ls -la out.*
