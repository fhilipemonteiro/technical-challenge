import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import ImageTemp from '@Helpers/ImageTemp';
import Env from '@Helpers/Env';
import getTypeImage from '@Helpers/GetTypeImage';

interface ResponseUploadImage {
  uri: string;
  mimeType: string;
};

interface IGemini {
  uploadImage: (base64Image: string) => Promise<ResponseUploadImage>;
  analysisConsumeMeter: (mimeType: string, fileUri: string) => Promise<number>;
};

export class GeminiService implements IGemini {

  private fileManager: GoogleAIFileManager;
  private generativeAI: GoogleGenerativeAI;
  private imageTemp: ImageTemp;

  constructor() {
    this.fileManager = new GoogleAIFileManager(Env.GEMINI_API_KEY);
    this.generativeAI = new GoogleGenerativeAI(Env.GEMINI_API_KEY);
    this.imageTemp = new ImageTemp();
  }

  public async uploadImage(base64Image: string): Promise<ResponseUploadImage> {
    const buffer = Buffer.from(base64Image, 'base64');

    const typeImage = await getTypeImage(buffer);

    const mimeType = `image/${typeImage}`;

    const tempPath = await this.imageTemp.writeImage(buffer, typeImage);

    const uploadResponse = await this.fileManager.uploadFile(tempPath, {
      mimeType,
      displayName: `Gemini-${Date.now()}.${typeImage}`
    });

    this.imageTemp.deleteImage(tempPath);

    return {
      uri: uploadResponse.file.uri,
      mimeType: uploadResponse.file.mimeType
    };
  }

  public async analysisConsumeMeter(mimeType: string, fileUri: string): Promise<number> {
    const model = this.generativeAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });

    const resultAnalysis = await model.generateContent([
      {
        fileData: {
          mimeType,
          fileUri,
        }
      },
      {
        text: 'Please analyze this image and extract the value of consume from the meter, must return just the value integer.'
      }
    ]);

    const consume = resultAnalysis.response.candidates?.[0]?.content.parts?.[0].text ?? '';
    
    const consumeMatch = consume.match(/(\d+)/)?.[0] ?? '';
    
    return Number(consumeMatch);
  }
}