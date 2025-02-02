/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  useForm,
  SubmitHandler,
  useWatch,
  FormProvider,
} from "react-hook-form";
import InputMask from "react-input-mask";
import { IconType } from "react-icons";
import { Select, Checkbox, Radio, RangeSlider } from "flowbite-react";
import { Controller } from "react-hook-form";
import DnDList from "./DnDList";
import { DragDropContext } from "react-beautiful-dnd";

export interface FormValidation {
  required?: boolean | string;
  pattern?: {
    value: RegExp;
    message: string;
  };
  maxLength?: {
    value: number;
    message: string;
  };
  minLength?: {
    value: number;
    message: string;
  };
  validate?: (value: any) => boolean | string;
  // Tambahkan validasi lain sesuai kebutuhan
}
export interface FormField {
  label: string;
  formName: string;
  type:
    | "string"
    | "email"
    | "number"
    | "selection"
    | "checkbox"
    | "radio"
    | "slider"
    | "custom"
    | "dnd";
  items?: Array<{ id: string; content: string }>;
  column?: string;
  validation?: FormValidation;
  validationMessage?: Record<string, string>;
  disabled?: boolean;
  mask?: string;
  option?: Array<{ label: string; value: string | number }>;
  min?: number;
  max?: number;
  customValue?: (value: any) => React.ReactNode;
  step?: number;
  icon?: IconType;
  iconPosition?: "left" | "right";
  iconOnClick?: (value: any) => void;
  showIcon?: boolean | ((formValues: any) => boolean);
  show?: (formValues: any) => boolean;
  render?: (props: {
    onChange: (...event: any[]) => void;
    onBlur: () => void;
    value: any;
    ref: React.Ref<any>;
    name: string;
  }) => React.ReactNode;
}

export interface DynamicFormProps {
  formData: FormField[][];
  onSubmit: SubmitHandler<any>;
  defaultValues?: Record<string, any>;
  submitButton?: React.ReactNode;
  isDetail?: boolean;
  customStyles?: {
    form?: string;
    row?: string;
    field?: string;
    label?: string;
    input?: string;
    error?: string;
    selection?: string;
    radioGroup?: string;
    slider?: string;
    buttonContainer?: string;
    detailContainer?: string;
    detailSelection?: string;
    detailCheckbox?: string;
    detailRadio?: string;
    detailSlider?: string;
    detailDndContainer?: string;
    detailDndItem?: string;
    detailDefault?: string;
  };
}

const DynamicsForm: React.FC<DynamicFormProps> = ({
  formData,
  onSubmit,
  defaultValues,
  customStyles,
  submitButton,
  isDetail,
}) => {
  const methods = useForm({
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    getValues,
    setValue,
    formState: { errors },
  } = methods;

  const formValues = useWatch({
    control,
    defaultValue: defaultValues,
  });

  const getColumnClass = (column?: string) => {
    if (!column) return "flex-1 w-full"; // Tambahkan w-full untuk default
    const [numerator, denominator] = column.split("/").map(Number);
    return `flex-1 basis-[${(numerator / denominator) * 100}%]`;
  };

  React.useEffect(() => {
    const subscription = watch(({ name }) => {
      if (name) {
        trigger(name);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, trigger]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const fieldName = result.source.droppableId; // Gunakan source.droppableId
    const currentItems = getValues(fieldName) || [];
    const [movedItem] = currentItems.splice(result.source.index, 1);
    currentItems.splice(result.destination.index, 0, movedItem);
    setValue(fieldName, currentItems, { shouldDirty: true });
  };

  const renderField = (field: FormField) => {
    if (field.show && !field.show(formValues)) {
      return null;
    }

    const commonProps = {
      id: field.formName,
      ...register(field.formName, {
        ...field.validation,
        // Tambahkan event handler untuk realtime validation
        onChange: () => {
          if (field.validation) {
            trigger(field.formName);
          }
        },
        onBlur: () => {
          if (field.validation) {
            trigger(field.formName);
          }
        },
      }),
      className: `${customStyles?.input || ""} ${
        errors[field.formName]
          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
      } transition-colors duration-300 ease-in-out`,
    };

    const renderDetailValue = () => {
      const value = formValues[field.formName];

      switch (field.type) {
        case "selection":
          const selectedOption = field.option?.find(
            (opt) => opt.value === value,
          );
          return (
            <div
              className={`${customStyles?.detailSelection || "rounded bg-gray-100 p-2"}`}
            >
              {selectedOption?.label || value}
            </div>
          );

        case "checkbox":
          return (
            <div
              className={`${customStyles?.detailCheckbox || "text-xl text-green-600"}`}
            >
              {field?.customValue(value) || (value ? "Ya" : "Tidak")}
            </div>
          );

        case "radio":
          const selectedRadio = field.option?.find(
            (opt) => opt.value === value,
          );
          return (
            <div
              className={`${customStyles?.detailRadio || "rounded bg-gray-100 p-2"}`}
            >
              {selectedRadio?.label || value}
            </div>
          );

        case "slider":
          return (
            <div
              className={`${customStyles?.detailSlider || "rounded-full bg-blue-100 px-3 py-2 text-center"}`}
            >
              {value}
            </div>
          );

        case "dnd":
          return (
            <div
              className={`${customStyles?.detailDndContainer || "space-y-2"}`}
            >
              {(value || []).map((item: any) => (
                <div
                  key={item.id}
                  className={`${customStyles?.detailDndItem || "rounded bg-gray-100 p-2"}`}
                >
                  {item.content}
                </div>
              ))}
            </div>
          );

        default:
          return (
            <div
              className={`${customStyles?.detailDefault || "rounded bg-gray-100 p-2"}`}
            >
              {value}
            </div>
          );
      }
    };

    if (isDetail) {
      return <div className="mt-1">{renderDetailValue()}</div>;
    }

    const Icon = field.icon;

    const Icons = Array.isArray(field.icon) ? field.icon : [field.icon];
    const iconPositions = Array.isArray(field.iconPosition)
      ? field.iconPosition
      : [field.iconPosition];
    const showIcons = Array.isArray(field.showIcon)
      ? field.showIcon
      : [field.showIcon];
    const iconClickHandlers = Array.isArray(field.iconOnClick)
      ? field.iconOnClick
      : [field.iconOnClick];

    const multipleIcons = Icons.map((Icon, index) => {
      const position = iconPositions[index] || "right";
      const show =
        typeof showIcons[index] === "function"
          ? showIcons[index](formValues)
          : showIcons[index] ?? true;

      return Icon && show ? (
        <button
          key={index}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            iconClickHandlers[index]?.();
          }}
          className={`
        absolute top-1/2 -translate-y-1/2
        ${position === "left" ? "left-3" : "right-3"}
        ${index > 0 && position === "right" ? "right-8" : ""}
        rounded-full p-1 transition-colors hover:bg-gray-100
      `}
        >
          <Icon className="text-lg text-gray-500" />
        </button>
      ) : null;
    });

    const shouldShowIcon =
      typeof field.showIcon === "function"
        ? field.showIcon(formValues)
        : field.showIcon ?? true;

    const inputPaddingClass =
      Icon && shouldShowIcon
        ? field.iconPosition === "left"
          ? "pl-10"
          : "pr-10"
        : "";

    const inputWrapperClass = `relative`;

    switch (field.type) {
      case "string":
      case "email":
      case "number": {
        const InputComponent = field.mask ? InputMask : "input";
        return (
          <div className={inputWrapperClass}>
            {multipleIcons}
            <InputComponent
              {...commonProps}
              type={field.type}
              mask={field.mask || ""}
              maskChar={null}
              disabled={field.disabled ?? false}
              className={`
                ${commonProps.className}
                w-full
                ${inputPaddingClass}
                rounded-lg border
                px-4 py-2.5
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500
              `}
            />
          </div>
        );
      }

      case "selection":
        return (
          <Select
            {...commonProps}
            className={`${commonProps.className} ${customStyles?.selection || ""}`}
            disabled={field.disabled ?? false}
          >
            {field.option?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        );

      case "checkbox":
        return <Checkbox {...commonProps} disabled={field.disabled ?? false} />;

      case "radio":
        return (
          <div className={`flex gap-4 ${customStyles?.radioGroup || ""}`}>
            {field.option?.map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <Radio
                  {...commonProps}
                  value={opt.value}
                  disabled={field.disabled ?? false}
                />
                <label>{opt.label}</label>
              </div>
            ))}
          </div>
        );

      case "slider":
        return (
          <RangeSlider
            {...commonProps}
            min={field.min}
            max={field.max}
            step={field.step}
            disabled={field.disabled ?? false}
          />
        );

      case "custom":
        return (
          <Controller
            name={field.formName}
            control={control}
            rules={field.validation}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <>
                {field.render
                  ? field.render({
                      onChange,
                      onBlur,
                      value: value || "",
                      ref,
                      name: field.formName,
                    })
                  : null}
              </>
            )}
          />
        );

      case "dnd":
        return (
          <Controller
            name={field.formName}
            control={control}
            rules={field.validation}
            defaultValue={[]}
            render={({ field: { onChange, value } }) => (
              <DnDList droppableId={field.formName} items={value || []}>
                {(item: any) => (
                  <div className="flex items-center justify-between">
                    <span>{item.content}</span>
                    <button
                      type="button"
                      disabled={field.disabled ?? false}
                      onClick={() =>
                        onChange(
                          (value || []).filter((i: any) => i.id !== item.id),
                        )
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </DnDList>
            )}
          />
        );

      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`${customStyles?.form || "space-y-6"}`}
        >
          {formData.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`${customStyles?.row || "flex flex-wrap gap-4"} w-full`}
            >
              {row.map((field) => (
                <div
                  key={field.formName}
                  className={`${getColumnClass(field.column)} ${customStyles?.field || "mb-4"} transition-all duration-300 ease-in-out`}
                >
                  <label
                    htmlFor={field.formName}
                    className={`${customStyles?.label || "mb-2 block text-sm font-medium text-gray-900"}`}
                  >
                    {field.label}
                  </label>

                  {renderField(field)}

                  {errors[field.formName] && (
                    <p
                      className={`${customStyles?.error || "mt-1 text-sm text-red-600"}`}
                    >
                      {/* Untuk multiple errors */}
                      {errors[field.formName]?.types &&
                        Object.keys(errors[field.formName].types).map(
                          (type) => (
                            <span key={type} className="block">
                              {field.validationMessage?.[type]}
                            </span>
                          ),
                        )}

                      {/* Untuk single error */}
                      {!errors[field.formName]?.types &&
                        field.validationMessage?.[
                          errors[field.formName]?.type as string
                        ]}

                      {/* Fallback untuk custom validation */}
                      {!field.validationMessage?.[
                        errors[field.formName]?.type as string
                      ] && String(errors[field.formName]?.message || "")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ))}

          <div
            className={`${customStyles?.buttonContainer || "mt-6 space-y-4"}`}
          >
            {submitButton || (
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </DragDropContext>
    </FormProvider>
  );
};

export default DynamicsForm;
