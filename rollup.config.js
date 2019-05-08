import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import packageJson from './package.json'
import typescript from 'rollup-plugin-typescript2'

const extensions = ['.js', '.ts']
const external = Object.keys(packageJson.dependencies)

export default {
  input: 'src/index.ts',
  output: {
    file: 'lib/redux-resource.js',
    format: 'cjs',
  },
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**',
  },
  external,
  plugins: [
    typescript(),
    resolve({
      extensions,
    }),
    commonjs({
      extensions,
    }),
    // terser(),
  ],
}
