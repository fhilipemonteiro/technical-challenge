import sharp from "sharp";

const getTypeImage = async (imageBuffer: Buffer): Promise<string> => {

  const typeImage = await sharp(imageBuffer).metadata().then((metadata) => metadata.format) as string;

  return typeImage;
}

export default getTypeImage;