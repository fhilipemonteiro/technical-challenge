import fs from 'fs';
import Logger from '@Helpers/Logger';

interface IImageTemp {
  writeImage(imageBuffer: Buffer, typeImage: string): Promise<string>;
  deleteImage(pathTemp: string): Promise<void>;
}

class ImageTemp implements IImageTemp {
  public async writeImage(imageBuffer: Buffer, typeImage: string): Promise<string> {
    return new Promise((resolve, _) => {
      const pathTemp = `${Date.now()}.${typeImage}`;
  
      fs.writeFileSync(pathTemp, imageBuffer);
  
      resolve(pathTemp);
    });
  }

  public async deleteImage(pathTemp: string): Promise<void> {
    return new Promise((resolve, _) => {
      fs.unlink(pathTemp, (err) => {
        if (err) {
          Logger.error(`Error to delete image temp: ${err}`);
          resolve();
        } else {
          resolve();
        }
      });
    });
  }
}

export default ImageTemp;