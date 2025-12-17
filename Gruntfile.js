module.exports = function(grunt) {
  
  // Конфигурация проекта
  grunt.initConfig({
    
    // Читаем информацию из package.json
    pkg: grunt.file.readJSON('package.json'),
    
    // Настройки компиляции LESS
    less: {
      // Режим разработки (с sourcemaps для отладки)
      development: {
        options: {
          paths: ['src/less'],           // Путь к LESS файлам
          sourceMap: true,                // Создаем sourcemap для отладки
          sourceMapFilename: 'dist/css/styles.css.map',
          sourceMapURL: 'styles.css.map',
          compress: false                 // Не сжимаем для удобства чтения
        },
        files: {
          'dist/css/styles.css': 'src/less/styles.less'  // Выходной файл: входной файл
        }
      },
      
      // Режим продакшена (минифицированный CSS)
      production: {
        options: {
          paths: ['src/less'],
          compress: true,                 // Сжимаем CSS
          cleancss: true,                 // Дополнительная оптимизация
          sourceMap: false                // Не создаем sourcemap для продакшена
        },
        files: {
          'dist/css/styles.min.css': 'src/less/styles.less'
        }
      }
    },
    
    // Настройки минификации CSS (опционально, если хотите отдельный шаг)
    cssmin: {
      target: {
        files: {
          'dist/css/styles.min.css': 'dist/css/styles.css'
        }
      }
    },
    
    // Настройки отслеживания изменений
    watch: {
      // Отслеживаем изменения в LESS файлах
      styles: {
        files: ['src/less/**/*.less'],   // Следим за всеми LESS файлами в папке
        tasks: ['less:development'],     // При изменении запускаем компиляцию
        options: {
          spawn: false,                   // Быстрее перезапускает задачи
          livereload: true                // Автообновление браузера (требует расширения)
        }
      }
    }
    
  });
  
  // Загружаем плагины Grunt
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  
  // Регистрируем задачи
  
  // Задача по умолчанию (для разработки)
  grunt.registerTask('default', ['less:development']);
  
  // Задача для режима разработки с отслеживанием изменений
  grunt.registerTask('dev', ['less:development', 'watch']);
  
  // Задача для продакшена (создает минифицированный CSS)
  grunt.registerTask('build', ['less:production']);
  
  // Задача для компиляции и минификации через cssmin
  grunt.registerTask('build-min', ['less:development', 'cssmin']);
  
};