import React, { useEffect, useState } from 'react';
import * as echarts from "echarts";
// import './App.css';

const skillsData = [
  {
    name: "Финансовый аналитик",
    mainSkills: ["Excel", "SQL", "VBA", "1С"],
    otherSkills: ["Power BI", "Python"],
  },
  {
    name: "Предприниматель",
    mainSkills: ["1C", "Excel", "Power BI"],
    otherSkills: [
      "Google Analytics",
      "Яндекс.Метрика",
      "Python",
      "SQL",
      "Tilda",
    ],
  },
  {
    name: "Продуктовый дизайнер",
    mainSkills: [
      "Figma",
      "Sketch",
      "Illustrator",
      "Photoshop",
      "Principle",
      "Tilda",
    ],
    otherSkills: ["Shopify", "Protopie", "Cinema 4D"],
  },
  {
    name: "Менеджер проекта",
    mainSkills: [
      "Visio",
      "1C",
      "Google Analytics",
      "Яндекс.Метрика",
      "Python",
      "SQL",
      "Tilda",
    ],
    otherSkills: ["Figma", "Sketch", "Shopify"],
  },
  {
    name: "Финансовый менеджер",
    mainSkills: ["1C", "Excel", "Power BI"],
    otherSkills: ["BPMN"],
  },
  {
    name: "Руководитель финансового департамента компании",
    mainSkills: ["Sketch", "Figma"],
    otherSkills: ["Shopify", "HQL"],
  },
  {
    name: "Продуктовый аналитик",
    mainSkills: [
      "Google Analytics",
      "Яндекс.Метрика",
      "SQL",
      "Power BI",
      "Python",
      "Excel",
    ],
    otherSkills: ["HQL", "Tableau", "R", "Machine learning"],
  },
  {
    name: "Руководитель финансового продукта",
    mainSkills: ["Visio"],
    otherSkills: ["Python"],
  },
  {
    name: "Менеджер по маркетингу",
    mainSkills: [
      "Google Analytics",
      "Яндекс.Метрика",
      "Google Ads",
      "Ahrefs",
      "Главред",
      "My Target",
    ],
    otherSkills: ["Tilda", "Photoshop", "Xenu", "Python"],
  },
  {
    name: "Менеджер по цифровой трансформации",
    mainSkills: [
      "Visio",
      "Google Analytics",
      "Яндекс.Метрика",
      "Python",
      "SQL",
      "Tilda",
    ],
    otherSkills: ["Figma", "Sketch", "Shopify"],
  },
];

// Создаем уникальный список компетенций из mainSkills и otherSkills
const uniqueCompetencies = (() => {
  const allCompetencies = new Set();
  skillsData.forEach(item => {
    item.mainSkills.forEach(skill => allCompetencies.add(skill)); // Добавляем mainSkills
    item.otherSkills.forEach(skill => allCompetencies.add(skill)); // Добавляем otherSkills
  });
  return Array.from(allCompetencies); // Возвращаем уникальный список компетенций
})();

function App() {
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    const chartDom = document.getElementById('main');
    const myChart = echarts.init(chartDom, null, { renderer: 'canvas', useDirtyRect: true });
    setChartInstance(myChart);
  
    const nodes = [];
    const links = [];
  
    // Внешний круг с компетенциями (mainSkills и otherSkills)
    uniqueCompetencies.forEach((competency, index) => {
      nodes.push({
        id: `competency-${index}`, // Уникальный id для компетенции
        name: competency,
        category: 'competency',
        value: 1,
        symbolSize: 60,
        itemStyle: { color: '#FFD4AD' }, // Цвет для компетенций
        x: Math.cos((index / uniqueCompetencies.length) * 2 * Math.PI) * 400, // Расположение на внешнем круге
        y: Math.sin((index / uniqueCompetencies.length) * 2 * Math.PI) * 400, // Расположение на внешнем круге
        label: {
          
        }
      });
    });
  
    // Внутренний круг с навыками (например, "Финансовый аналитик", "Предприниматель")
    skillsData.forEach((skill, index) => {
      nodes.push({
        id: `skill-${index}`, // Уникальный id для навыка
        name: skill.name,
        category: 'skill',
        value: 1,
        symbolSize: 40,
        itemStyle: { color: '#ADADAD' }, // Цвет для навыков
        x: Math.cos((index / skillsData.length) * 2 * Math.PI) * 200, // Расположение на внутреннем круге
        y: Math.sin((index / skillsData.length) * 2 * Math.PI) * 200, // Расположение на внутреннем круге
        label: {
          show: true,
          position: 'outside',
          fontSize: 12,
        }
      });
    });
  
    // Установка опций графика
    myChart.setOption({
      title: {
        text: 'График навыков и компетенций',
        left: 'center',
      },
      series: [
        {
          type: 'graph',
          layout: 'none', // Управляем расположением вручную
          data: nodes,
          links: [], // По умолчанию без линий
          roam: true, // Возможность перемещения
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1,
          },
          label: {
            show: true,
            position: 'outside', // Устанавливаем для внешнего круга
            fontSize: 12,
          },
          lineStyle: {
            opacity: 0.6,
            width: 2,
            curveness: 0.3,
          },
          animationDurationUpdate: 1500,
          animationEasingUpdate: 'cubicOut',
          labelLayout: function (params) {
            const node = params.data;
            if (node && node.category === 'competency') {
              // Рассчитываем угол для текущего узла
              const angle = Math.atan2(node.y, node.x);
              const offset = 60; // Расстояние от узла до метки
              const dx = Math.cos(angle) * offset;
              const dy = Math.sin(angle) * offset;
              return {
                dx: dx,
                dy: dy,
                align: Math.abs(angle) < Math.PI / 2 ? 'left' : 'right',
                verticalAlign: 'middle',
              };
            }
            return {};
          },
          
        },
      ],
    });

    // Логика при клике на навыки (внутренний круг)
    myChart.on('click', function (params) {
  // Сброс всех предыдущих выделений и связей
  const resetNodes = nodes.map(node => ({
    ...node,
    itemStyle: {
      ...node.itemStyle,
      color: node.category === 'competency' ? '#FFD4AD' : '#ADADAD' // Восстанавливаем оригинальный цвет круга
    },
    label: {
      ...node.label, // Оставляем метку без изменений
    }
  }));
  
  const resetLinks = []; // Сбрасываем все линии

  myChart.setOption({
    series: [{
      data: resetNodes,
      links: resetLinks,
    }]
  });
  
  if (params.data.category === 'skill') {
    const clickedSkill = params.data.name;

    // Ищем все компетенции, связанные с данным навыком
    const newLinks = [];
    const highlightedCompetencies = new Set();

    skillsData.forEach((skill) => {
      if (skill.name === clickedSkill) {
        // Добавляем линии к mainSkills
        skill.mainSkills.forEach(mainSkill => {
          newLinks.push({
            source: `skill-${skillsData.indexOf(skill)}`,
            target: `competency-${uniqueCompetencies.indexOf(mainSkill)}`,
            lineStyle: { color: 'orange', width: 3 }, // Основные компетенции (mainSkills)
          });
          highlightedCompetencies.add(mainSkill); // Добавляем компетенцию для окрашивания
        });

        // Добавляем линии к otherSkills
        skill.otherSkills.forEach(otherSkill => {
          newLinks.push({
            source: `skill-${skillsData.indexOf(skill)}`,
            target: `competency-${uniqueCompetencies.indexOf(otherSkill)}`,
            lineStyle: { color: 'purple', width: 3 }, // Дополнительные компетенции (otherSkills)
          });
          highlightedCompetencies.add(otherSkill); // Добавляем компетенцию для окрашивания
        });
      }
    });

    // Обновляем цвет навыка на зеленый и компетенций на оранжевый
    const updatedNodes = nodes.map(node => {
      if (node.id === params.data.id) {
        return {
          ...node,
          itemStyle: {
            ...node.itemStyle,
            color: 'green', // Меняем цвет выбранного навыка на зеленый
          },
          label: {
            ...node.label, // Оставляем метку без изменений
          }
        };
      } else if (highlightedCompetencies.has(node.name)) {
        return {
          ...node,
          itemStyle: {
            ...node.itemStyle,
            color: 'orange', // Меняем цвет связанных компетенций на ярко-оранжевый
          },
          label: {
            ...node.label, // Оставляем метку без изменений
          }
        };
      }
      return node;
    });

    // Обновляем график с новыми узлами и связями
    myChart.setOption({
      series: [{
        data: updatedNodes,
        links: newLinks, // Добавляем связи от навыка к компетенциям
      }]
    });
  }

  // Логика при клике на компетенции (внешний круг)
  if (params.data.category === 'competency') {
    const clickedCompetency = params.data.name;

    // Найти все навыки, которые относятся к этой компетенции
    const newLinks = [];
    const highlightedSkills = new Set();

    skillsData.forEach((competency) => {
      if (competency.mainSkills.includes(clickedCompetency) || competency.otherSkills.includes(clickedCompetency)) {
        newLinks.push({
          source: `competency-${uniqueCompetencies.indexOf(clickedCompetency)}`,
          target: `skill-${skillsData.indexOf(competency)}`,
          lineStyle: { color: competency.mainSkills.includes(clickedCompetency) ? 'orange' : 'purple', width: 3 },
        });
        highlightedSkills.add(competency.name);
      }
    });

    // Обновляем цвет выбранной компетенции на ярко-оранжевый и связанных навыков на зеленый
    const updatedNodes = nodes.map(node => {
      if (node.name === clickedCompetency) {
        return {
          ...node,
          itemStyle: {
            ...node.itemStyle,
            color: 'orange', // Меняем цвет выбранной компетенции на ярко-оранжевый
          },
          label: {
            ...node.label, // Оставляем метку без изменений
          }
        };
      } else if (highlightedSkills.has(node.name)) {
        return {
          ...node,
          itemStyle: {
            ...node.itemStyle,
            color: 'green', // Меняем цвет связанных навыков на зеленый
          },
          label: {
            ...node.label, // Оставляем метку без изменений
          }
        };
      }
      return node;
    });

    // Обновляем график с новыми узлами и связями
    myChart.setOption({
      series: [{
        data: updatedNodes,
        links: newLinks, // Добавляем связи от компетенции к навыкам
      }]
    });
  }
});

    


    // Устанавливаем пассивные обработчики событий для предотвращения блокировки
    chartDom.addEventListener('wheel', (e) => e.preventDefault(), { passive: true });

    return () => {
      myChart.dispose();
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '900px' }}>
      <div id="main" style={{ width: '100%', height: '100%' }}></div>
    </div>
  );
}

export default App;
