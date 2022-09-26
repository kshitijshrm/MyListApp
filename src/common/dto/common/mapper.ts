import { CreateFileRequest } from 'src/shared/schemas/os1/core/file/request.pb';
import { CreateFileResponse } from 'src/shared/schemas/os1/core/file/response.pb';
import { SolutionDocumentMetadata } from 'src/shared/schemas/os1/developerportal/solution/solution.pb';
import { CreateFileResponseDTO } from './response';

export class SchemaToDtoMapper {
  static async mapToCreateFileResponseDTO(
    response: CreateFileResponse,
  ): Promise<CreateFileResponseDTO> {
    return {
      fileId: response.fileMetadata.id.fileId,
      fileName: response.fileMetadata.attributes.fileName,
      fileDescription: response.fileMetadata.attributes.fileDescription,
      fileUrl: response.fileMetadata.attributes.fileUrl ?? undefined,
    };
  }
}

export class DtoToSchemaMapper {
  static createFileRequest(
    file: Express.Multer.File,
    description?: string,
  ): CreateFileRequest {
    return {
      fileBinary: new Uint8Array(file.buffer),
      fileName: file.originalname,
      fileContentType: file.mimetype,
      fileDescription: description ?? '',
      isCdnRequired: false,
    };
  }

  static createCdnFileRequest(
    file: Express.Multer.File,
    description?: string,
  ): CreateFileRequest {
    const fileRequest = DtoToSchemaMapper.createFileRequest(file, description);
    fileRequest.isCdnRequired = true;
    return fileRequest;
  }
}
