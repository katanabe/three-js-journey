import {FC} from 'react';
import { URL } from 'url';

type CodeSandboxProps = {
  dir: string;
  title: string;
}

// (.ex) '/example/hoge/hoge'
const getSourceFile = (dir: string) => {
  const appPath = '/src/App.jsx';
  const githubBranch = 'github/pmndrs/threejs-journey/tree/main';

  const url = new URL(`/${githubBranch}/${dir}`, 'https://codesandbox.io/embed');
  url.searchParams.set('view', 'preview');
  url.searchParams.set('hidenavigation', '1');
  url.searchParams.set('module', appPath);
  return url.toString();
}

export const CodeSandbox: FC<CodeSandboxProps> = ({dir, title}) => {
  return (
    <iframe
      src={getSourceFile(dir)}
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        border: 0,
      }}
      width="100%"
      height="100%"
      title={title}
      allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
      sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
    />
  );
}