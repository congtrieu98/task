"use client";

import { Tool, NewToolParams, insertToolParams } from "@/lib/db/schema/tools";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const ToolForm = ({
  tool,
  closeModal,
}: {
  tool?: Tool;
  closeModal: () => void;
}) => {
  const { toast } = useToast();

  const editing = !!tool?.id;

  const router = useRouter();
  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof insertToolParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertToolParams),
    defaultValues: tool ?? {
      name: "",
      status: "",
      weeklyWorkId: "",
      quantityRemaining: "",
    },
  });

  const onSuccess = async (action: "create" | "update" | "delete") => {
    await utils.tools.getTools.invalidate();
    router.refresh();
    closeModal();
    toast({
      title: "Success",
      description: `Tool ${action}d!`,
      variant: "default",
    });
  };

  const { data: w } = trpc.weeklyWorks.getWeeklyWorks.useQuery();

  const { mutate: createTool, isLoading: isCreating } =
    trpc.tools.createTool.useMutation({
      onSuccess: () => onSuccess("create"),
    });

  const { mutate: updateTool, isLoading: isUpdating } =
    trpc.tools.updateTool.useMutation({
      onSuccess: () => onSuccess("update"),
    });

  const { mutate: deleteTool, isLoading: isDeleting } =
    trpc.tools.deleteTool.useMutation({
      onSuccess: () => onSuccess("delete"),
    });

  const handleSubmit = (values: NewToolParams) => {
    if (editing) {
      updateTool({ ...values, id: tool.id });
    } else {
      createTool(values);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="weeklyWorkId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thuộc công việc</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn công việc" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {w?.weeklyWorks.map((wlw) => (
                    <SelectItem value={wlw.name} key={wlw.id} spellCheck>
                      {wlw.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => {
            console.log("field:", field.value);
            return (
              <FormItem>
                <FormLabel>Trạng thái</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={
                    field.value === "Bình thường"
                      ? "normal"
                      : field.value === "Bị hư/hỏng"
                      ? "damaged"
                      : field.value === "Còn >= 50%"
                      ? "hight"
                      : field.value === "Còn < 50%"
                      ? "low"
                      : ""
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="normal">Bình thường</SelectItem>
                    <SelectItem value="damaged">Bị hư/hỏng</SelectItem>
                    <SelectItem value="hight">Còn &gt;=50% </SelectItem>
                    <SelectItem value="low">Còn &lt;50% </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="quantityRemaining"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số lần còn sử dụng được</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mr-1"
          disabled={isCreating || isUpdating}
        >
          {editing
            ? `Sav${isUpdating ? "ing..." : "e"}`
            : `Creat${isCreating ? "ing..." : "e"}`}
        </Button>
        {editing ? (
          <Button
            type="button"
            variant={"destructive"}
            onClick={() => deleteTool({ id: tool.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default ToolForm;