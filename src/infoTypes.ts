
export type RequestType = {
    type: 'command' | 'argCommand';
    command: string;
    args?: string;
  }
  
  export type ResponseType = {
    type: 'plainText' | 'errcode';
    success: boolean;
    message: string;
  }
  