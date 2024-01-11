'use client'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { $Enums } from "@prisma/client";
import { useSession } from "next-auth/react";
import { UseFormReturn } from "react-hook-form";

interface dataSelected {
    key: string;
    value: string
}

interface dataUser {
    users: {
        id: string;
        name: string | null;
        email: string | null;
        emailVerified: Date | null;
        image: string | null;
        role: $Enums.UserRole;
    }[];
}
const SelectedForm = ({ form, title, dataOption, name, editting, placeholder, dataUser }:
    {
        form: UseFormReturn, title: string, dataOption: dataSelected[]
        editting: boolean, name: string, placeholder: string, dataUser: dataUser
    }) => {
    const { data: session } = useSession()
    return (
        <>
            <FormField
                control={form.control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{title}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={
                            session?.user?.role !== "ADMIN"
                        }>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={placeholder} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {
                                    dataUser ? dataUser?.users.map((item) => {
                                        return <SelectItem key={item.id} value={item.id} spellCheck>
                                            {item.name}
                                        </SelectItem>
                                    }
                                    ) :
                                        dataOption?.map((item, index) => {
                                            return <SelectItem key={index} value={item.key} spellCheck>
                                                {item.value}
                                            </SelectItem>
                                        }
                                        )}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
}

export default SelectedForm;