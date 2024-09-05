"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CallDrop } from "../icons/callDrop";

import {
  LocalUser,
  RemoteUser,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import { useState } from "react";
import { Call } from "../icons/call";
import { Video } from "../icons/video";
import { VideoDrop } from "../icons/videoDrop";
import { Mic } from "../icons/mic";
import { MicDrop } from "../icons/micDrop";
import { AGORA_APP_ID } from "@/const";

const CallDialog = (props: {
  setOpen: any;
  calling: any;
  incoming?: any;
  setCalling: any;
  channel: string;
  declineCall?: any;
}) => {
  // Is calling
  const [appId, setAppId] = useState(AGORA_APP_ID); // Store the app ID state
  // Store the channel name state
  const [token, setToken] = useState(null); // Store the token state

  useJoin({ appid: appId, channel: props.channel, token }, props.calling);

  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(false);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);
  usePublish([localMicrophoneTrack, localCameraTrack]);

  // Remote user
  const remoteUsers = useRemoteUsers();

  return (
    <DialogContent
      className="w-[50vw] h-[70vh]"
      onInteractOutside={(e) => {
        e.preventDefault();
      }}
    >
      {props.incoming && !props.calling && (
        <>
          <DialogHeader>
            <DialogTitle>Incoming Call</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex gap-3 row-reverse">
            <Button onClick={props.setCalling(true)}>Accept</Button>
            <Button onClick={props.declineCall()}>Decline</Button>
          </DialogFooter>
        </>
      )}
      {props.calling && (
        <>
          <DialogHeader>
            <DialogTitle>On-Call</DialogTitle>
          </DialogHeader>
          <div className="user-list m-10 flex gap-4 items-center justify-center">
            <LocalUser
              className="max-w-[10vw]"
              audioTrack={localMicrophoneTrack}
              cameraOn={cameraOn}
              micOn={micOn}
              videoTrack={localCameraTrack}
              cover="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-circle-icon.png"
            >
              <samp className="p-4">You</samp>
            </LocalUser>
            {remoteUsers.map((user) => {
              return (
                <div className="user h-[100%] w-[10vw]" key={user.uid}>
                  {/* {user.uid} */}
                  <RemoteUser
                    className="max-w-[10vw] h-[20vh]"
                    cover="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/boy-child-color-icon.png"
                    user={user}
                    playAudio
                  >
                    <samp className="user-name">{user.uid}</samp>
                  </RemoteUser>
                </div>
              );
            })}
          </div>
          <DialogFooter className="flex gap-3 row-reverse">
            <Button
              type="button"
              onClick={() => {
                setCamera((a) => !a);
              }}
              size="icon"
              variant={cameraOn ? "destructive" : "secondary"}
            >
              {!cameraOn ? <Video height={20} /> : <VideoDrop height={20} />}
            </Button>
            <Button
              type="button"
              onClick={() => {
                setMic((a) => !a);
              }}
              size="icon"
              variant={micOn ? "destructive" : "secondary"}
            >
              {!micOn ? <Mic height={20} /> : <MicDrop height={20} />}
            </Button>
            <Button
              type="button"
              onClick={() => {
                props.setCalling(false);
                props.setOpen(false);
              }}
              size="icon"
              variant={props.calling ? "destructive" : "secondary"}
            >
              {props.calling ? <CallDrop height={20} /> : <Call height={20} />}
            </Button>
          </DialogFooter>
        </>
      )}
    </DialogContent>
  );
};

export default CallDialog;
