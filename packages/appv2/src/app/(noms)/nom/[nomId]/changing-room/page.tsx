import AnimatedTabs from "@/components/AnimatedTabs";
import AnimatedTabsVertical from "@/components/AnimatedTabsVertical";
import ChangingRoomRow from "../../components/ChangingRoomRow";
import LayerStack from "../../components/LayerStack";

const WavyTab = () => {
  return (
    <div className="absolute left-[-68px] top-1/2 flex flex-row -rotate-90">
      <svg
        width="41"
        height="22"
        viewBox="0 0 41 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M41 0L41 22L-9.6165e-07 22C8.04908 22 13.1581 13.4499 19.3681 7.97848C28.4233 0.00021212 32.4479 9.78539e-05 41 0Z"
          fill="#151515"
        />
      </svg>
      <span className="bg-[#151515] h-[22px] px-1 flex items-center justify-center text-xs uppercase oziksoft">
        Hide
      </span>
      <svg
        width="41"
        height="22"
        viewBox="0 0 41 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 0L-9.61651e-07 22L41 22C32.9509 22 27.8419 13.4499 21.6319 7.97848C12.5767 0.000213219 8.55215 9.86015e-05 0 0Z"
          fill="#151515"
        />
      </svg>
    </div>
  );
};

const ChangingRoom = () => {
  return (
    <main className="h-[calc(100vh-66px)] w-full">
      <section className="pt-12 flex flex-row space-x-2 h-full w-full">
        <div className="w-[288px]">
          <LayerStack />
        </div>
        <div className="flex-1 bg-[#151515] rounded-[24px] flex flex-row">
          <div className="p-1 h-full flex-1">
            <div
              className="h-full w-full rounded-[20px] p-4"
              style={{
                backgroundColor: "#222222",
                // backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23ffffff' fill-opacity='0.08' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
              }}
            >
              <h3 className="oziksoft text-xl">Nom 1</h3>
              <span className="text-sm text-[#818080] pangram-sans font-semibold">
                Not yet finalized
              </span>
            </div>
          </div>
          <div className="relative p-4 w-[700px] h-full overflow-hidden">
            <WavyTab />
            <div className="flex flex-col h-full">
              <div className="flex flex-row justify-between w-full">
                <AnimatedTabs />
                <span className="oziksoft text-2xl cursor-pointer">Cart</span>
              </div>
              <div className="mt-4 h-full flex flex-row space-x-2 w-full">
                <div className="w-[140px] h-full bg-gray-900 rounded-lg p-2 flex flex-col space-y-2">
                  <span className="bg-gray-800 rounded-full text-center text-sm">
                    Up
                  </span>
                  <AnimatedTabsVertical />
                  <span className="bg-gray-800 rounded-full text-center text-sm">
                    Down
                  </span>
                </div>
                <div className="flex-1 flex flex-col">
                  <input
                    type="text"
                    className="bg-gray-900 w-[200px] h-6 block rounded"
                  />
                  <div className="w-full bg-gray-900 p-2 rounded-lg mt-2">
                    <h3 className="pangram-sans-compact font-bold">
                      Changing room
                    </h3>
                    <div className="mt-2 flex flex-row flex-wrap gap-2">
                      <div className="min-w-20 w-1/8 aspect-square rounded-lg bg-gray-800"></div>
                      <div className="min-w-20 w-1/8 aspect-square rounded-lg bg-gray-800"></div>
                      <div className="min-w-20 w-1/8 aspect-square rounded-lg bg-gray-800"></div>
                    </div>
                  </div>
                  <hr className="mt-2 border-gray-900" />
                  <div className="pt-2">
                    <h3 className="pangram-sans-compact font-bold">Closet</h3>
                    <ChangingRoomRow />
                    <ChangingRoomRow />
                    <ChangingRoomRow />
                  </div>
                  <div className="bg-gray-900 mt-2 rounded-lg p-2 flex-1">
                    <h3 className="pangram-sans font-bold">
                      Glasses blue green square
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ChangingRoom;
