

// declare module "midtrans-client" {
//   class Snap {
//     constructor(options: { isProduction: boolean; serverKey: string; clientKey?: string });
//     createTransaction(params: object): Promise<{ token: string; redirect_url: string }>;
//   }

//   class CoreApi {
//     constructor(options: { isProduction: boolean; serverKey: string; clientKey?: string });
//     charge(params: object): Promise<any>;
//   }

//   const midtransClient: {
//     Snap: typeof Snap;
//     CoreApi: typeof CoreApi;
//   };

//   export = midtransClient;
// }
