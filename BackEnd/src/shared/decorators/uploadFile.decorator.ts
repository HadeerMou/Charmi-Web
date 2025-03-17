// import {
//   BadRequestException,
//   createParamDecorator,
//   ExecutionContext,
// } from '@nestjs/common';

// export const UploadFileArray = createParamDecorator(
//   async (
//     data: {
//       filePath: string;
//       key: string;
//     },
//     ctx: ExecutionContext,
//   ) => {
//     const { filePath, key } = data;
//     const request = ctx.switchToHttp().getRequest();
//     if (!request.files || !request.files[key]) {
//       throw new Error(`No file array found for key: ${key}`);
//     }
//     let files = request.files[key];
//     let storage = getStorage();

//     let urls = await Promise.all(
//       files.map(async (file, index) => {
//         let date = Date.now();
//         let storageRef = ref(storage, filePath + date + file['originalname']);
//         let fileBuffer = sharpInstance
//           ? await sharpInstance.transformImage(file['buffer'])
//           : file['buffer'];
//         let snapShot = await uploadBytesResumable(storageRef, fileBuffer, {
//           contentType: file['mimetype'],
//         });
//         return await getDownloadURL(snapShot.ref);
//       }),
//     );
//     return urls;
//   },
// );

// export const UploadFile = createParamDecorator(
//   async (
//     data: {
//       filePath: string;
//       isRequired?: boolean;
//     },
//     ctx: ExecutionContext,
//   ) => {
//     const { filePath, isRequired } = data;
//     const request = ctx.switchToHttp().getRequest();
//     if (isRequired && !request.file) {
//       throw new BadRequestException('File is required');
//     }
//     if (!request.file) {
//       return null;
//     }
//     let file = request.file;
//     let fileBuffer = sharpInstance
//       ? await sharpInstance.transformImage(file['buffer'])
//       : file['buffer'];
//     let storage = getStorage();
//     let date = Date.now();
//     let storageRef = ref(storage, filePath + date + file['originalname']);
//     let snapShot = await uploadBytesResumable(storageRef, fileBuffer, {
//       contentType: file['mimetype'],
//     });
//     return await getDownloadURL(snapShot.ref);
//   },
// );

// export const UploadFileFields = createParamDecorator(
//   async (
//     data: {
//       filePath: string;
//       fields: {
//         name: string;
//         maxCount: number;
//         isRequired?: boolean;
//       }[];
//     },
//     ctx: ExecutionContext,
//   ) => {
//     let { filePath, fields, sharpInstance } = data;
//     const request = ctx.switchToHttp().getRequest();
//     let storage = getStorage();
//     let fieldUrls: Record<string, string[]> = {};

//     await Promise.all(
//       fields.map(async (field) => {
//         if (!field.isRequired && !request.files) {
//           return [];
//         }
//         let files = request.files[field.name];

//         if (field.isRequired && !files && !files.length) {
//           throw new BadRequestException(`${field.name} is required`);
//         }
//         if (!files) {
//           return null;
//         }

//         let urls = await Promise.all(
//           files.map(async (file, index) => {
//             let date = Date.now();
//             let storageRef = ref(
//               storage,
//               filePath + date + file['originalname'],
//             );
//             let fileBuffer = sharpInstance
//               ? await sharpInstance.transformImage(file['buffer'])
//               : file['buffer'];
//             let snapShot = await uploadBytesResumable(storageRef, fileBuffer, {
//               contentType: file['mimetype'],
//             });
//             return await getDownloadURL(snapShot.ref);
//           }),
//         );
//         return (fieldUrls[`${field.name}`] = urls);
//       }),
//     );
//     return fieldUrls;
//   },
// );
