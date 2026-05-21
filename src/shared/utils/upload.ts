export type UploadPromise<T> = Promise<T> & { abort: () => void };

export const upload = <T>(
  file: File,
  url: string,
  options?: { onProgress?: (progress: number) => void }
): UploadPromise<T> => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = "json";
  xhr.withCredentials = true; 


  const onProgress = options?.onProgress;

  const promise = new Promise((resolve, reject) => {
    xhr.open("PATCH", url);

    xhr.upload.onprogress = (event) => {
      onProgress?.(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onload = () => {
      if (xhr.status === 200) resolve(xhr.response);
      else reject(xhr.response);
    };

    const myData = new FormData();
    myData.append("file", file);

    xhr.send(myData);
  }) as UploadPromise<T>;

  promise.abort = () => xhr.abort();

  return promise;
};
