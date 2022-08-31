import { defineConfig,loadEnv  } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import viteCompression from 'vite-plugin-compression'
import styleImport from 'vite-plugin-style-import'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

//这个配置 为了在html中使用 环境变量
function getViteEnv(mode, target){
	return loadEnv(mode, process.cwd())[target];
};

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    plugins: [
        vue(),
        viteCompression(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
        //按需导入element-plus的css样式
        styleImport({
            libs: [
                {
                    libraryName: 'element-plus',
                    esModule: true,
                    resolveStyle: name => {
                        return `element-plus/theme-chalk/${name}.css`
                    },
                },
            ],
        })
    ],
    build: {
        assetsDir: 'static',
        emptyOutDir: true,
        brotliSize: false,
        terserOptions: {
            compress: {
                // 打包自动删除console
                drop_console: true,
                // 对代码压缩的次数，默认是1，压缩次数越多，时间越长
                passes: 10
            }
        }
    },
    server: {
        host: '0.0.0.0',
        open: true, // 如果需要在服务启动后自动打开页面可以打开这个设置
        port: 4000,//启动端口
        proxy: {
            '/api': {
                // target: 'http://192.168.2.183:9090',
                // target: 'http://192.168.2.254:9090', // 线下
                target: 'https://bentong.yunkesoftware.cn/apis',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, '')
            },
            '/mey': {
                // target: 'http://192.168.2.183:8011',
                // target: 'http://192.168.2.254:9090', // 线下
                target: 'https://bentong.yunkesoftware.cn/apis',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/mey/, '')
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@c': path.resolve(__dirname, 'src/components'),
            '@cn': path.resolve(__dirname, 'src/common'),
            '@p': path.resolve(__dirname, 'src/plugins'),
            '@u': path.resolve(__dirname, 'src/utils'),
            '@v': path.resolve(__dirname, 'src/views')
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "@/main.scss";`
            },
            less: {
                javascriptEnabled: true,
            }
        }
    }
});


