import glob
import os

index = 1
for file in glob.glob("stage/*"):
    print(file);
    os.system("ffmpeg -i '{}' {}.ogg".format(file, index))
    index = index + 1
