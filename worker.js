self.onmessage = ({ data }) => {
  if (data.type === 'ping') self.postMessage({ type: 'ping', message: data.message });
};
self.postMessage({ type: 'ready' });
