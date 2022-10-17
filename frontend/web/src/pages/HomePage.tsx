const HomePage = (): JSX.Element => {
  const showNoti = () => {
    Notification.requestPermission().then((perm) => {
      console.log(perm);
      if (perm === "granted") {
        const noti = new Notification("EXample", {
          body: "more tex",
          data: {
            hello: "haha",
          },
        });

        noti.addEventListener("error", (err) => {
          console.log(err);
          alert("error: ");
        });
      }
    });
  };

  return (
    <div>
      <h1 className="font-bold text-center text-7xl mt-7">Plantera</h1>
      <button
        onClick={showNoti}
        className="flex m-auto px-2 py-1 rounded-full
        duration-100 bg-color-dark-2 hover:bg-color-dark-1"
      >
        Noti
      </button>
    </div>
  );
};

export default HomePage;
