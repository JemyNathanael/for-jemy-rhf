"use client";
import { profileSchema } from "@/interfaces/ProfileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, Upload } from "antd";
import { RcFile, UploadChangeParam, UploadFile } from "antd/es/upload";
import { profile } from "console";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

export default function Home() {
  const {
    watch,
    formState: { errors },
    control,
    setValue,
    handleSubmit,
  } = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      type: "",
      position: "",
      profile: [{ images: [], descriptions: "", titles: "" }],
    },
  });

  const onFormSubmit = async (data: z.infer<typeof profileSchema>) => {
    console.log("Successfully Submitted");
    console.log(data);
    const formData = new FormData();

    formData.append("type", data.type);
    formData.append("position", data.position);

    data.profile.forEach((profile, index) => {
      formData.append(`profile[${index}].titles`, profile.titles);
      formData.append(`profile[${index}].descriptions`, profile.descriptions);

      profile.images?.forEach((file: File) => {
        formData.append(`profile[${index}].images[0]`, file);
      });
    });

    try {
      const response = await fetch("http://localhost:8080/your-endpoint", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Server response:", result);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  console.log(watch("position"));
  console.log(watch("type"));

  const { append, remove, fields } = useFieldArray({
    name: "profile",
    control,
  });

  const handleFileChange = (
    info: UploadChangeParam<UploadFile<any>>,
    index: number
  ) => {
    if (
      info.file.originFileObj != null &&
      info.file.originFileObj?.size >= 5000000
    ) {
      return;
    }

    if (info.fileList.length > 0) {
      // Extract the files from fileList
      const files = info.fileList
        .map((file) => file.originFileObj)
        .filter((file): file is RcFile => file !== undefined);
      setValue(`profile.${index}.images`, files);
    }
  };

  return (
    <main className="h-screen w-full bg-stone-900 p-6 flex flex-col justify-center items-center overflow-hidden">
      <div className="h-3/4 overflow-y-auto container px-10">
        <Form onFinish={handleSubmit(onFormSubmit)} className="relative">
          <div className="h-90% bg-stone-800 p-4 rounded-md">
            <div className="bg-stone-700 rounded-md p-10 text-white mb-10">
              <h1 className="mb-10 text-center text-xl font-bold">
                GG JEMY NATHANAEL
              </h1>
              <Form.Item
                label={<p className="text-white w-20 text-left">Type</p>}
              >
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Input
                      {...field}
                      onChange={field.onChange}
                      value={field.value}
                    />
                  )}
                />
              </Form.Item>

              <Form.Item
                label={<p className="text-white w-20 text-left">Position</p>}
              >
                <Controller
                  control={control}
                  name="position"
                  render={({ field }) => (
                    <Input
                      {...field}
                      onChange={field.onChange}
                      value={field.value}
                    />
                  )}
                />
              </Form.Item>
            </div>

            {fields.map((item, index) => (
              <div key={item.id} className="mt-10">
                <Form.Item
                  label={<p className="text-white w-20 text-left">Title</p>}
                >
                  <Controller
                    control={control}
                    name={`profile.${index}.titles`}
                    render={({ field }) => (
                      <Input
                        {...field}
                        onChange={field.onChange}
                        value={field.value}
                      />
                    )}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <p className="text-white w-20 text-left">Description</p>
                  }
                >
                  <Controller
                    control={control}
                    name={`profile.${index}.descriptions`}
                    render={({ field }) => (
                      <Input
                        {...field}
                        onChange={field.onChange}
                        value={field.value}
                      />
                    )}
                  />
                </Form.Item>

                <Form.Item
                  label={<p className="text-white w-20 text-left">Image</p>}
                >
                  <Controller
                    control={control}
                    name={`profile.${index}.images`}
                    render={({ field }) => (
                      <Upload
                        fileList={field.value || []}
                        onChange={(info) => handleFileChange(info, index)}
                        multiple={false}
                      >
                        <Button>Upload Something</Button>
                      </Upload>
                    )}
                  />
                </Form.Item>

                {index > 0 && (
                  <Button
                    className="bg-red-600 text-red-100"
                    onClick={() => remove(index)}
                  >
                    Remove Item
                  </Button>
                )}
              </div>
            ))}
          </div>
          <div className="space-x-4 fixed z-10 left-0 mt-10 bottom-0 p-4 flex justify-center bg-stone-50 w-full">
            <Button
              className="bg-green-600 text-green-100"
              onClick={() =>
                append({ titles: "", descriptions: "", images: [] })
              }
            >
              Add Item
            </Button>
            <Button htmlType="submit">Submit</Button>
          </div>
        </Form>
      </div>
    </main>
  );
}
