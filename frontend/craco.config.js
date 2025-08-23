// Load configuration from environment or config file
const path = require('path');

// Environment variable overrides
const config = {
  disableHotReload: process.env.DISABLE_HOT_RELOAD === 'true',
};

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig, { env, paths }) => {
      
      // Production optimizations
      if (env === 'production') {
        // Optimize chunks for better caching
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              // React/ReactDOM in separate chunk
              react: {
                test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                name: 'react',
                chunks: 'all',
                priority: 20,
              },
              // UI libraries in separate chunk
              radix: {
                test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
                name: 'radix-ui',
                chunks: 'all',
                priority: 15,
              },
              // Lucide icons in separate chunk
              lucide: {
                test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
                name: 'lucide',
                chunks: 'all',
                priority: 15,
              },
              // Other vendor libraries
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
                priority: 10,
                reuseExistingChunk: true,
              },
            },
          },
          // Minimize runtime chunk overhead
          runtimeChunk: {
            name: 'runtime',
          },
          // Remove source maps in production (saves bandwidth)
          minimize: true,
          moduleIds: 'deterministic',
          chunkIds: 'deterministic',
        };

        // Remove source maps in production for smaller files
        webpackConfig.devtool = false;
      }
      
      // Disable hot reload completely if environment variable is set
      if (config.disableHotReload) {
        // Remove hot reload related plugins
        webpackConfig.plugins = webpackConfig.plugins.filter(plugin => {
          return !(plugin.constructor.name === 'HotModuleReplacementPlugin');
        });
        
        // Disable watch mode
        webpackConfig.watch = false;
        webpackConfig.watchOptions = {
          ignored: /.*/, // Ignore all files
        };
      } else {
        // Add ignored patterns to reduce watched directories
        webpackConfig.watchOptions = {
          ...webpackConfig.watchOptions,
          ignored: [
            '**/node_modules/**',
            '**/.git/**',
            '**/build/**',
            '**/dist/**',
            '**/coverage/**',
            '**/public/**',
          ],
        };
      }
      
      return webpackConfig;
    },
  },
  babel: {
    plugins: [
      // Remove console.log in production
      ...(process.env.NODE_ENV === 'production' 
        ? [['transform-remove-console', { exclude: ['error', 'warn'] }]]
        : []
      ),
    ],
  },
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  devServer: {
    compress: true,
    // Enable HTTP/2 for development  
    http2: false, // Set to true if you have HTTPS setup
  },
};