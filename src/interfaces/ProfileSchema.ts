import { RcFile } from "antd/es/upload";
import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
];

export const profileSchema = z.object({
  type: z.string(),
  position: z.string(),
  profile: z.array(
    z.object({
      titles: z.string(),
      descriptions: z.string(),
      images: z.any(),
    })
  ),
});
