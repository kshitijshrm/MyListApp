export interface RecordStatus {
  isActive?: boolean;
  isDeleted?: boolean;
}

export interface FileMetadataDTO {
  fileId: string;
  fileName: string;
  fileDescription: string;
  fileUrl?: string | undefined;
}
export interface DocumentMetadataDTO {
  category: string;
  document: FileMetadataDTO;
}

export interface ConfigurationMetadataDTO {
  category: string;
  configurationFile: FileMetadataDTO;
}
