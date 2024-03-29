"use client";

import Button from "@/components/Button";
import DatePicker from "@/components/DatePicker";
import { differenceInDays } from "date-fns";
import Input from "@/components/Input";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

interface TripReservationProps {
  tripId: string;
  tripEndDate: Date;
  tripStartDate: Date;
  maxGuests?: number;
  pricePerDay: number;
}

//tipando a validação
interface TripResrvationForm {
  guests: number;
  startDate: Date | null;
  endDate: Date | null;
}

const TripReservation = ({
  tripStartDate,
  tripEndDate,
  maxGuests,
  pricePerDay,
  tripId,
}: TripReservationProps) => {
  //passando a tipagem da validação para o form
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setError,
  } = useForm<TripResrvationForm>();

  const router = useRouter();

  const { status } = useSession();

  const HandleSubmitPress = async (data: TripResrvationForm) => {
    const response = await fetch("/api/trips/check", {
      method: "POST",
      body: Buffer.from(
        JSON.stringify({
          startDate: data.startDate,
          endDate: data.endDate,
          tripId,
        })
      ),
    });

    const res = await response.json();
    console.log({ res });

    if (res?.error?.code === "TRIP_ALREADY_RESERVED") {
      setError("startDate", {
        type: "manual",
        message: "Esta data já está reservada.",
      });

      return setError("endDate", {
        type: "manual",
        message: "Esta data já está reservada.",
      });
    }

    if (status === "authenticated") {
      return router.push(
        `/trips/${tripId}/confirmation?startDate=${data.startDate?.toISOString()}&endDate=${data.endDate?.toISOString()}&guests=${
          data.guests
        }`
      );
    }

    if (status === "unauthenticated") {
      signIn();
      console.log(signIn)
    }
  };

  const stardate = watch("startDate");
  const enddate = watch("endDate");

  return (
    <div className="flex flex-col px-5 lg:w-[380px] lg:p-5 lg:border lg:rounded-lg lg:border-grayLighter lg:shadow-md">
      <p className="text-xl text-primaryDarker mb-4 hidden lg:block ">
        <span className="font-semibold">R${pricePerDay}</span> por dia
      </p>

      <div className="flex gap-4 ">
        <Controller
          name="startDate"
          rules={{
            required: {
              value: true,
              message: "Data inicial é obrigatória.",
            },
          }}
          control={control}
          render={({ field }) => (
            <DatePicker
              error={!!errors?.startDate}
              errorMessage={errors?.startDate?.message}
              onChange={field.onChange}
              selected={field.value}
              className="w-full"
              placeholderText="Data de Início"
              minDate={tripStartDate}
            />
          )}
        />

        <Controller
          name="endDate"
          rules={{
            required: {
              value: true,
              message: "Data final é obrigatória.",
            },
          }}
          control={control}
          render={({ field }) => (
            <DatePicker
              error={!!errors?.endDate}
              errorMessage={errors?.endDate?.message}
              onChange={field.onChange}
              selected={field.value}
              className="w-full"
              placeholderText="Data final"
              minDate={stardate ?? tripStartDate}
            />
          )}
        />
      </div>
      <Input
        {...register("guests", {
          required: {
            value: true,
            message: "Número de hóspedes é obrigatório",
          },
          max: {
            value: Number(maxGuests),
            message: `Número de hóspedes (max: ${maxGuests})`,
          },
        })}
        className="mt-4"
        placeholder={`Número de Hóspedes (max: ${maxGuests})`}
        // colocando o filedset vermelho
        error={!!errors?.guests}
        //colocando a mensagem de error
        errorMessage={errors?.guests?.message}
        type="number"
      />
      <div className="flex justify-between mt-3">
        <p className="font-medium text-sm text-primaryDarker">Total: </p>
        <p className="font-medium text-sm text-primaryDarker">
          {stardate && enddate
            ? `R${differenceInDays(enddate, stardate) * pricePerDay}`
            : "R$0"}
        </p>
      </div>

      <div className="pb-10 border-b border-grayLighter w-full lg:pb-0 lg:border-none">
        <Button
          onClick={() => handleSubmit(HandleSubmitPress)()}
          className="mt-3 w-full"
        >
          Reservar agora
        </Button>
      </div>
    </div>
  );
};

export default TripReservation;
