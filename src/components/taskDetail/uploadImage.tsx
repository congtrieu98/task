/* eslint-disable @next/next/no-img-element */
'use client'

import { uploadVercel } from "@/lib/utils";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Dispatch, Key, SetStateAction, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { useSession } from "next-auth/react";


interface FileWithPreview extends File {
    preview?: string;
    loading?: boolean;
    path?: string;
}

const UploadImage = ({ t, taskId, files, setFiles }: { t: any, taskId: string, files: File[], setFiles: Dispatch<SetStateAction<File[]>> }) => {
    const router = useRouter()
    const { data: session } = useSession()

    const mutationHistories = trpc.histories.createHistory.useMutation();
    const { mutate: deleteImage, isLoading: isImageDeleting } =
        trpc.medias.deleteMedia.useMutation({
            onSuccess: () => {
                mutationHistories.mutate({
                    taskId: taskId as string,
                    createAt: new Date(),
                    content: "đã xóa ảnh",
                    userId: session?.user?.id as string,
                });
                router.refresh();
                toast({
                    title: "Success",
                    description: `Image deledated!`,
                    variant: "default",
                });
            },
        });

    const onDrop = useCallback((acceptedFiles: Array<FileWithPreview>) => {
        if (acceptedFiles?.length) {
            setFiles((previousFiles) => [
                ...previousFiles,
                ...acceptedFiles.map((file) => ({
                    ...file,
                    loading: true,
                    erorrs: [],
                })),
            ]);

            acceptedFiles.forEach((file, index) => {
                uploadVercel(file).then((url) => {
                    setFiles((previousFiles) =>
                        previousFiles.map((prevFile, prevIndex) => {
                            if (
                                prevIndex ===
                                index + previousFiles.length - acceptedFiles.length
                            ) {
                                return { ...prevFile, preview: url, loading: false };
                            } else {
                                return prevFile;
                            }
                        })
                    );
                });
            });
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            "image/*": [],
        },
        maxSize: 1024 * 1000,
        onDrop,
    });


    useEffect(() => {
        return () =>
            files.forEach((file: FileWithPreview) =>
                URL.revokeObjectURL(file.preview as string)
            );
    }, [files]);

    const removeFile = (path: string) => {
        setFiles((files) =>
            files.filter((file: FileWithPreview) => file.path !== path)
        );
    };
    return (
        <>
            <div className="text-xl font-semibold">Image</div>
            <section className="border border-gray-100 p-5 rounded-xl shadow-md max-w-xl">
                <div
                    {...getRootProps()}
                    className="p-2 border border-dashed border-gray-300"
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center gap-4">
                        <ArrowUpTrayIcon className="w-5 h-5 fill-current" />
                        {isDragActive ? (
                            <p>Drop the files here ...</p>
                        ) : (
                            <p>Drag & drop files here, or click to select files</p>
                        )}
                    </div>
                </div>
                {/* Accepted files */}
                <h3 className="title text-lg font-semibold text-neutral-600 mt-4 border-b pb-3">
                    Accepted Files
                </h3>
                <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
                    {(t?.tasks?.medias?.length as number) > 0 &&
                        t?.tasks?.medias.map((item: { url: string | undefined; id: any; }, index: Key | null | undefined) => (
                            <li key={index} className="relative h-auto rounded-md">
                                {isImageDeleting ? (
                                    <svg
                                        className="absolute top-[-10px] sm:right-0 right-[156px] animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="black"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="black"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                ) : (
                                    <>
                                        <img
                                            src={item.url}
                                            alt={item.url}
                                            className="h-full w-full object-contain rounded-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                deleteImage({ id: item.id });
                                            }}
                                            className="w-5 h-5 border border-secondary-400 bg-secondary-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 transition-colors bg-black"
                                        >
                                            <XMarkIcon className="w-5 h-5 fill-white hover:fill-secondary-400 transition-colors" />
                                        </button>
                                    </>
                                )}
                            </li>
                        ))}
                    {files.map((file: FileWithPreview, index) => (
                        <li key={index} className="relative h-auto rounded-md">
                            {file.loading ? (
                                <svg
                                    className="absolute top-[-10px] sm:right-0 right-[156px] animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="black"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="black"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            ) : (
                                <>
                                    <img
                                        src={file.preview}
                                        alt={file.name}
                                        onLoad={() => {
                                            URL.revokeObjectURL(file.preview as string);
                                        }}
                                        className="h-full w-full object-contain rounded-md"
                                    />
                                    <button
                                        type="button"
                                        className="w-5 h-5 border border-secondary-400 bg-secondary-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 transition-colors bg-black"
                                        onClick={() => removeFile(file.path as string)}
                                    >
                                        <XMarkIcon className="w-5 h-5 fill-white hover:fill-secondary-400 transition-colors" />
                                    </button>
                                </>
                            )}
                            <div className=" text-neutral-500 text-[12px] font-medium">
                                {/* {file.path} */}
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </>
    );
}

export default UploadImage;