import { FcOk } from "react-icons/fc";

interface TripHightLightsProps {
  hightLights: string[];
}

const TripHightLights = ({ hightLights }: TripHightLightsProps) => {
  return (
    <div className="flex flex-col p-5 lg:p-0 lg:mt-12">
      <h2 className="font-semibold text-primaryDarker mb-2 lg:text-xl">Destaques</h2>

      <div className="flex flex-wrap gap-y-3 lg:mt-5">
        {hightLights.map((hightLights, index) => (
          <div key={hightLights} className="flex items-center gap-2 w-1/2 lg:gap-3">
            <FcOk />

            <p className="text-grayPrimary text-xs lg:text-base">{hightLights}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripHightLights;
