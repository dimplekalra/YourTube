import React, { Component } from "react";
import screenfull from "screenfull";
import { findDOMNode } from "react-dom";
import * as noUiSlider from "nouislider";
import "nouislider/dist/nouislider.css";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import ReactPlayer from "react-player";
import { IAcceptAll, TParams } from "../../../common/interfaces";

// declare const screenFuller: Screenfull = screenfull.isEnabled == false ? {isEnabled:false} : screenfull  ;
const screenFull: any = screenfull;

interface IState {
  playing: boolean;
  played: number;
  muted: boolean;
  volume: number;
  loaded: number;
  duration: number;
  ended: boolean;
  playbackRate: number;
  loop: boolean;
  seeking: boolean;
  fullscreen: boolean;
  videoError: boolean;
}

class MediaPlayer extends Component<
  IAcceptAll & RouteComponentProps<TParams>,
  IState
> {
  state = {
    playing: true,
    played: 0.0,
    muted: false,
    volume: 0.8,
    loaded: 0,
    duration: 0.0,
    ended: false,
    playbackRate: 1.0,
    loop: false,
    seeking: false,
    fullscreen: false,
    videoError: false,
  };
  player = React.createRef<any>();
  sliderRef = React.createRef<HTMLDivElement>();
  volumeRef = React.createRef<HTMLDivElement>();

  seekSlider: noUiSlider.API | null = null;

  volumeSlider: noUiSlider.API | null = null;

  componentDidMount() {
    if (screenFull.isEnabled === false) {
      screenFull.on("change", () => {
        let fullscreen =
          screenFull.hasOwnProperty("isFullscreen") && screenFull.isFullscreen
            ? true
            : false;
        this.setState({ fullscreen: fullscreen });
      });
    }

    this.initSlider();
  }

  setVolume = (value: number | string | (string | number)[]) => {
    let num =
      typeof value === "string"
        ? parseFloat(value)
        : typeof value === "number"
        ? value
        : typeof value[0] === "string"
        ? parseFloat(value[0])
        : value[0];

    this.setState({ volume: num });
  };
  toggleMuted = () => {
    this.setState({ muted: !this.state.muted });
  };
  playPause = () => {
    this.setState({ playing: !this.state.playing });
  };
  onLoop = () => {
    this.setState({ loop: !this.state.loop });
  };
  onProgress = (progress: {
    played: number;
    loaded: number;
    playedSeconds: number;
    loadedSeconds: number;
  }): void => {
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.setState({ played: progress.played, loaded: progress.loaded });
    }
  };
  onClickFullScreen = () => {
    if (this.player.current) {
      let el: Element | null = findDOMNode(
        this.player.current
      ) as HTMLVideoElement;
      if (el) {
        screenFull.request(el);
      }
    }
  };
  onEnded = () => {
    if (this.state.loop) {
      this.setState({ playing: true });
    } else
      this.props.handleAutoplay(() => {
        this.setState({ ended: true, playing: false });
      });
  };
  onDuration = (duration: number) => {
    this.setState({ duration });
  };
  onSeekMouseDown = () => {
    this.setState({ seeking: true });
  };
  onSeekChange = (value: string | number) => {
    if (typeof value === "string") {
      this.setState({
        played: parseFloat(value),
        ended: parseFloat(value) >= 1,
      });
    } else {
      this.setState({
        played: value,
        ended: value >= 1,
      });
    }
  };

  onSeekMouseUp = (value: number | string | (string | number)[]) => {
    this.setState({ seeking: false });
    if (this.player.current) {
      if (typeof value === "string")
        this.player.current.seekTo(parseFloat(value));
      else this.player.current.seekTo(value);
    }
  };
  videoError = () => {
    this.setState({ videoError: true });
  };

  format = (seconds: number) => {
    const date: Date = new Date(seconds * 1000);
    const hh: string | number = date.getUTCHours();
    let mm: string | number = date.getUTCMinutes();

    const ss = date.getUTCSeconds().toString().slice(-2);

    if (hh) {
      mm = ("0" + date.getUTCMinutes()).slice(-2);
      return `${hh}:${mm}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  initSlider = () => {
    if (this.sliderRef.current) {
      this.seekSlider = noUiSlider.create(this.sliderRef.current, {
        start: this.state.played,
        range: { min: 0, max: 1 },
        animate: true,
        // step: 0.1,

        connect: "lower",
      });

      // this.slider.on("end", () => {
      //   console.log(this.slider.get());
      //   this.onSeekMouseUp(this.slider.get() );
      // });

      this.seekSlider.on("change", () => {
        if (this.seekSlider) this.onSeekMouseUp(this.seekSlider.get());
      });
    }

    if (this.volumeRef.current) {
      this.volumeSlider = noUiSlider.create(this.volumeRef.current, {
        start: this.state.volume,
        range: { min: 0, max: 1 },
        animate: true,
        // step: 0.1,

        connect: "lower",
      });

      // this.slider.on("end", () => {
      //   console.log(this.slider.get());
      //   this.onSeekMouseUp(this.slider.get() );
      // });

      this.volumeSlider.on("change", () => {
        if (this.volumeSlider) this.setVolume(this.volumeSlider.get());
      });
    }
  };

  componentDidUpdate(prevProps: IAcceptAll, prevState: IState) {
    if (prevState.played !== this.state.played && this.seekSlider) {
      this.seekSlider.set(this.state.played);
    }
    if (prevState.volume !== this.state.volume && this.volumeSlider) {
      this.volumeSlider.set(this.state.volume);
    }
  }

  render() {
    const {
      playing,
      ended,
      volume,
      muted,
      loop,
      played,
      // loaded,
      duration,
      playbackRate,
      fullscreen,
      videoError,
    } = this.state;

    return (
      <div className="row media-player">
        <div className="col s12">
          <div className="row">
            <div className="col s12">
              {videoError ? (
                <div className="col s12 center-align">
                  <p className="red-text valign-wrapper">
                    Video Error. Try again later.
                  </p>
                </div>
              ) : (
                <ReactPlayer
                  className="video-sec"
                  ref={this.player}
                  width={fullscreen ? "100%" : "inherit"}
                  height={fullscreen ? "100%" : "inherit"}
                  style={
                    fullscreen
                      ? { position: "relative" }
                      : { maxHeight: "500px" }
                  }
                  // config={{
                  //   attributes: { style: { height: "100%", width: "100%" } },
                  // }}
                  url={this.props.srcUrl}
                  playing={playing}
                  loop={loop}
                  playbackRate={playbackRate}
                  volume={volume}
                  muted={muted}
                  onEnded={this.onEnded}
                  onError={this.videoError}
                  onProgress={this.onProgress}
                  onDuration={this.onDuration}
                />
              )}
            </div>
          </div>
          <div className="row player-control">
            <div className="col s12 range-field">
              <div id="test-slider" ref={this.sliderRef}></div>
              {/* <input
                id="sliderValueInput"
                type="range"
                value={played}
                onMouseDown={this.onSeekMouseDown}
                onChange={this.onSeekChange}
                onMouseUp={this.onSeekMouseUp}
              /> */}

              {/* <p className="range-field">
                <input
                  type="range"
                  min={0}
                  max={1}
                  value={played}
                  step="any"
                  onMouseDown={this.onSeekMouseDown}
                  onChange={this.onSeekChange}
                  onMouseUp={this.onSeekMouseUp}
                />
              </p> */}
              <div className="row">
                <div className="col s8">
                  <div className="col">
                    <button
                      className="btn-floating waves-effect "
                      onClick={this.playPause}
                    >
                      <i className="material-icons">
                        {playing ? "pause" : ended ? "replay" : "play_arrow"}
                      </i>
                    </button>
                  </div>
                  <div className="col ">
                    <button
                      disabled={!this.props.nextUrl}
                      className="btn-floating waves-effect "
                    >
                      <Link to={this.props.nextUrl}>
                        <i className="material-icons">skip_next</i>
                      </Link>
                    </button>
                  </div>
                  <div className="col volume">
                    <div className="row">
                      <div className="col s1 volume-icon">
                        <button
                          className="btn-floating waves-effect "
                          onClick={this.toggleMuted}
                        >
                          <i className="material-icons">
                            {volume > 0 && !muted && volume > 0.5
                              ? "volume_up"
                              : volume > 0 && !muted && volume < 0.5
                              ? "volume_down"
                              : muted
                              ? "volume_off"
                              : volume === 0.0
                              ? "volume_mute"
                              : ""}
                          </i>
                        </button>
                      </div>
                      <div className="col s9 volume-slider ">
                        <div id="test-slider" ref={this.volumeRef}></div>
                        {/* <p className="range-field">
                          <input
                            type="range"
                            min={0}
                            max={1}
                            step="any"
                            value={muted ? 0 : volume}
                            onChange={this.setVolume}
                            style={{ verticalAlign: "middle" }}
                          />
                        </p> */}
                      </div>
                    </div>
                  </div>
                  <div className="col time">
                    <span
                      style={{
                        float: "right",
                        padding: "10px",
                        color: "#fff",
                      }}
                    >
                      <time dateTime={`P${Math.round(duration * played)}S`}>
                        {this.format(duration * played)}
                      </time>
                      /{" "}
                      <time dateTime={`P${Math.round(duration)}S`}>
                        {this.format(duration)}
                      </time>
                    </span>
                  </div>
                </div>

                <div className="col s4 full-screen-sec">
                  <div className="col ">
                    <button
                      className="btn-floating waves-effect"
                      onClick={this.onLoop}
                    >
                      <i className="material-icons">
                        {loop ? "repeat_one" : "repeat"}
                      </i>
                    </button>
                  </div>
                  <div className="col">
                    <button
                      className="btn-floating waves-effect "
                      onClick={this.onClickFullScreen}
                    >
                      <i className="material-icons">fullscreen</i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// MediaPlayer.propTypes = {
//   srcUrl: PropTypes.string,
//   nextUrl: PropTypes.string,
//   handleAutoplay: PropTypes.func.isRequired,
// };

export default withRouter(MediaPlayer);
