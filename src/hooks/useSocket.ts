import { useEffect, useRef } from 'react';
import io from "socket.io-client";
import type { Socket } from "socket.io-client";



/** Connects to `/commitments` namespace and forwards events to handler */
export default function useSocket(onEvent: (event: string, payload: any) => void) {
const ref = useRef<typeof Socket | null>(null);
useEffect(() => {
const socket = io(`${window.location.origin}/commitments`, { transports: ['websocket'] });
ref.current = socket;


const f = (ev: string) => (data: any) => onEvent(ev, data);
socket.on('commitment.created', f('created'));
socket.on('commitment.updated', f('updated'));
socket.on('commitment.completed', f('completed'));
socket.on('commitment.deleted', f('deleted'));
socket.on('commitment.archived', f('archived'));


return () => { socket.disconnect(); ref.current = null; };
}, [onEvent]);
return ref;
}