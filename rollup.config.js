import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import typescript from 'rollup-plugin-typescript2';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

const banner = `/*!
 * MultiLevelSelect v${packageJson.version}
 * A lightweight, customizable JavaScript plugin for implementing multi-level cascading selection
 * Author: ${packageJson.author}
 * License: ${packageJson.license}
 * GitHub: ${packageJson.homepage}
 */
`;

export default [
  // 未压缩的版本
  {
    input: 'src/MultiLevelSelect.ts',
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        useTsconfigDeclarationDir: true
      })
    ],
    output: [
      {
        file: 'dist/MultiLevelSelect.cjs.js',
        format: 'cjs',
        sourcemap: true,
        banner: banner
      },
      {
        file: 'dist/MultiLevelSelect.esm.js',
        format: 'es',
        sourcemap: true,
        banner: banner
      },
      {
        file: 'dist/MultiLevelSelect.iife.js',
        format: 'iife',
        name: 'MultiLevelSelect',
        sourcemap: true,
        banner: banner
      }
    ]
  },
  // 压缩的版本
  {
    input: 'src/MultiLevelSelect.ts',
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        useTsconfigDeclarationDir: true
      }),
      replace({
        preventAssignment: true,
        values: {
          '// BANNER_PLACEHOLDER': banner
        }
      }),
      terser({
        module: true,
        compress: {
          drop_console: true,
          drop_debugger: true,
          unused: true,
          dead_code: true,
          booleans: true,
        },
        output: {
          comments: false,
          preamble: banner
        }
      })
    ],
    output: [
      {
        file: 'dist/MultiLevelSelect.cjs.min.js',
        format: 'cjs',
        sourcemap: true
      },
      {
        file: 'dist/MultiLevelSelect.esm.min.js',
        format: 'es',
        sourcemap: true
      },
      {
        file: 'dist/MultiLevelSelect.iife.min.js',
        format: 'iife',
        name: 'MultiLevelSelect',
        sourcemap: true
      }
    ]
  }
];