declare type CreateDtsOptions = Partial<{
    defaultType: string;
    importTypes: Import[];
}>;

export declare const generateDtsFile: ({ name, directory, parser, options, }: GenerateDtsFileParams) => Promise<void>;

declare type GenerateDtsFileOptions = Partial<{
    fileName: string;
    output: (dts: string) => unknown;
    createDts: CreateDtsOptions;
}>;

declare type GenerateDtsFileParams = {
    name: string;
    parser: Parser;
    directory: string;
    options?: GenerateDtsFileOptions;
};

declare type Import = {
    name: string;
    from: string;
};

declare type Parser = () => Promise<object> | object;

export { }
