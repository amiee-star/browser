chcp 65001
echo 拷贝文件到服务器目录
xcopy "H:/Yunzhan4d/Gitlab/YunzhanV3_Browser/dist" "H:/Yunzhan4d/Yunzhan4d_Server/ui/assets/viewer" /s /e /y /exclude:H:\Yunzhan4d\Gitlab\YunzhanV3_Browser\exclude.txt
pause