import axios from 'axios';
import { AdminApiSystemUploadFile } from '@/api/tags/文件上传';
import { previewUrlFile } from '@/utils/file';
import { useUserStore } from '@/store/modules/user';
const userId = useUserStore().getUser.id;
export default class UploadAdapter {
  constructor(private loader: any) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(
      (file: any) =>
        new Promise((resolve, reject) => {
          AdminApiSystemUploadFile.uploadFile({ file, userId, securityLevel: 1 })
            .then((res: any) => {
              if (res.data.code === 200) {
                const url = res.data.data.fileUrl;
                console.log(`--------------------${url}`);
                resolve({
                  default: url,
                  // default: 'http://10.190.113.233:31016/common-api/common/file-storage/preview?id=1859554625478811650',
                });
              }
            })
            .catch((error: any) => {
              reject(error);
            });
        }),
    );
  }

  abort() {}
}
