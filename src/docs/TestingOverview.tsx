import { DocsBranch, DocsDiagram, DocsGrid } from './components/docs-diagram'
import s from './docs.module.scss'

/** Testing section landing page (Storybook canvas). */
export const TestingOverview = () => (
  <div className={s.page}>
    <h1>Проверка изменений</h1>

    <p>
      Здесь можно запускать проверки прямо из Storybook. Они <strong>не</strong>{' '}
      стартуют сами — только по кнопке «Запустить».
    </p>

    <p>
      Перед запуском можно сузить прогон: какие задания брать (все раскладки,
      реальные задачи класса или полный набор), какой класс и какой вариант
      шаблона. По умолчанию шаблон не ограничен — проверяются все. Результаты
      пишутся на диск; если что-то упало, откройте вкладку{' '}
      <a href="?path=/story/testing-падения--default">Падения</a>: там история и полный
      лог.
    </p>

    <h2>Какой набор выбрать</h2>

    <DocsDiagram caption="От проверки данных до живого приложения">
      <DocsGrid
        items={[
          {
            title: 'Данные и логика',
            description:
              'Проверяют данные и логику задания без открытия браузера. Подходят, чтобы быстро поймать поломку в файлах задач.',
          },
          {
            title: 'В окне задачи',
            description:
              'Открывают задание в Storybook и проходят сценарии: раскладки, задачи класса, тренажёр.',
          },
          {
            title: 'В живом приложении',
            description:
              'Идут в настоящее приложение на вашем компьютере. При ошибке сохраняют снимки экрана и запись. Нужно, чтобы приложение было запущено.',
          },
        ]}
      />
    </DocsDiagram>

    <h2>Как пользоваться</h2>

    <DocsBranch
      caption="Как запустить проверку и куда смотреть результат"
      tree={{
        type: 'start',
        title: 'Откройте раздел Testing',
        description: 'Страница «Запуск» или короткий экран одного набора',
        next: {
          type: 'start',
          title: 'Выберите, что гонять, и нажмите «Запустить»',
          description: 'Набор, охват и шаблон — по умолчанию можно оставить «все»',
          next: {
            type: 'question',
            title: 'Всё прошло без ошибок?',
            branches: [
              {
                label: 'да',
                next: {
                  type: 'outcome',
                  title: 'Смотрите статус и лог',
                  description: 'На той же странице видно, что прогон завершился',
                },
              },
              {
                label: 'нет',
                next: {
                  type: 'outcome',
                  title: 'Откройте «Падения»',
                  description: 'Там история упавших прогонов и полный лог',
                },
              },
            ],
          },
        },
      }}
    />

    <p>
      Для проверок в живом приложении можно включить{' '}
      <strong>«Показать окно браузера»</strong> — откроется видимое окно, чтобы
      глазами увидеть, где сценарий ломается.
    </p>

    <h3>Ссылки</h3>

    <ul>
      <li>
        <a href="?path=/story/testing-запуск--default">Запуск</a>
      </li>
      <li>
        <a href="?path=/story/testing-данные-и-логика--default">Данные и логика</a>
      </li>
      <li>
        <a href="?path=/story/testing-в-окне-задачи--default">В окне задачи</a>
      </li>
      <li>
        <a href="?path=/story/testing-в-живом-приложении--default">
          В живом приложении
        </a>{' '}
        — нужно приложение на порту 8888
      </li>
      <li>
        <a href="?path=/story/testing-падения--default">Падения</a>
      </li>
    </ul>

    <details className={s.collapse}>
      <summary>Подробнее</summary>
      <div className={s.collapseBody}>
        <p>
          Те же проверки можно запустить из терминала, не открывая Storybook:
          данные и логика — <code>pnpm test:unit</code>, в окне задачи —{' '}
          <code>pnpm test:interactions</code>, в живом приложении —{' '}
          <code>pnpm test:e2e</code>.
        </p>

        <p>
          Если нужно прогнать не всё подряд, а например только реальные задачи
          пятого класса для шаблона <code>text/ui/plain</code>, перед командой
          задают переменные окружения охвата, класса и шаблона (те же смыслы, что
          фильтры на экране «Запуск»).
        </p>

        <pre>
          <code>{`STORYBOOK_TEST_SCOPE=allTasks STORYBOOK_TEST_GRADE=5 STORYBOOK_TEST_TEMPLATE=text/ui/plain pnpm test:unit`}</code>
        </pre>

        <p>
          Набор «Данные и логика» смотрит fixtures и логику каталога заданий.
          Проверки в окне задачи проходят сценарии stories в Storybook (раскладки
          и задачи класса). Живое приложение гоняет сценарии через Playwright; при
          падении сохраняются снимки, запись и лог. История прогонов из Storybook
          лежит в <code>test-artifacts/</code> — оттуда же читает вкладка
          «Падения».
        </p>
      </div>
    </details>
  </div>
)
