import { build, BuildOptions } from 'esbuild';

const buildOptions: BuildOptions = {
  bundle: true,
  entryPoints: ["src/index.ts"],
  minify: true,
  outdir: 'sam/build',
  platform: 'node',
  sourcemap: true,
  loader: {
    ".ts": "ts"
  }
};

build(buildOptions);
