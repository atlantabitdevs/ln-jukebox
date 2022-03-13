import { VFC, useState, useEffect } from "react";


export const WebPlayback = (token) => {
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [player, setPlayer] = useState(null);
  const [current_track, setTrack] = useState(null);
  console.log(token.token.access_token)
  const settings = {
    headers: {'Authorization': 'Bearer ' + token.token.access_token,
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  }
  console.log(settings)
  const response = fetch('https://api.spotify.com/v1/me', settings).then((res) => {
    console.log(res.json())
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          console.log(token.access_token);
          cb(token.access_token);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }

        setTrack(state.track_window.current_track);
        setPaused(state.paused);

        player.getCurrentState().then((state) => {
          console.log(state)
          if (!state) {
            setActive(false);
          } else {
            setActive(true);
          }
        });
      });

      player.connect();
    };
  }, [token]);

  if (!player) {
    return (
      <>
        <div className="container">
          <div className="main-wrapper">
            <b>Spotify Player is null</b>
          </div>
        </div>
      </>
    );
  } else if (!is_active) {
    return (
      <>
        <div className="container">
          <div className="main-wrapper">
            <b>
              Instance not active. Transfer your playback using your Spotify app
            </b>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="container">
          <div className="main-wrapper">
            <div className=""></div>
            {current_track && current_track.album.images[0].url ? (
              <img
                src={current_track.album.images[0].url}
                className="now-playing__cover"
                alt=""
              />
            ) : null}

            <div className="now-playing__side">
              <div className="now-playing__name">{current_track?.name}</div>
              <div className="now-playing__artist">
                {current_track?.artists[0].name}
              </div>

              <button
                className="btn-spotify"
                onClick={() => {
                  player.previousTrack();
                }}
              >
                &lt;&lt;
              </button>

              <button
                className="btn-spotify"
                onClick={() => {
                  player.togglePlay();
                }}
              >
                {is_paused ? "PLAY" : "PAUSE"}
              </button>

              <button
                className="btn-spotify"
                onClick={() => {
                  player.nextTrack();
                }}
              >
                &gt;&gt;
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
};