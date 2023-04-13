import dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { GoogleDriveService } from "./services/GoogleDriveService";

dotenv.config();

const driveClientId = process.env.GOOGLE_DRIVE_CLIENT_ID || "";
const driveClientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET || "";
const driveRedirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI || "";
const driveRefreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN || "";

(async () => {
  const googleDriveService = new GoogleDriveService(
    driveClientId,
    driveClientSecret,
    driveRedirectUri,
    driveRefreshToken
  );

  const finalPath = path.resolve(__dirname, "600x400.png");

  //   console.log(finalPath);

  if (!fs.existsSync(finalPath)) {
    throw new Error("File not found!");
  }

  const folderName = "NomeDoAluno";

  let folder = await googleDriveService
    .searchFolder(folderName)
    .catch((error) => {
      console.error(error);
      return null;
    });

  //   console.log(folder?.id);

  if (!folder) {
    folder = await googleDriveService.createFolder(folderName);
  }

  await googleDriveService
    .saveFile("nome-generico", finalPath, "image/png", folder.id)
    .catch((error: Error) => {
      console.error(error);
    });

  console.info("File uploaded successfully!");
})();
