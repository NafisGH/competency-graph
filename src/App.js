import React, { useEffect, useState } from "react";
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
    otherSkills: ["Google Analytics", "Яндекс.Метрика", "Python", "SQL", "Tilda"],
  },
  {
    name: "Продуктовый дизайнер",
    mainSkills: ["Figma", "Sketch", "Illustrator", "Photoshop", "Principle", "Tilda"],
    otherSkills: ["Shopify", "Protopie", "Cinema 4D"],
  },
  {
    name: "Менеджер проекта",
    mainSkills: ["Visio", "1C", "Google Analytics", "Яндекс.Метрика", "Python", "SQL", "Tilda"],
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
    mainSkills: ["Google Analytics", "Яндекс.Метрика", "SQL", "Power BI", "Python", "Excel"],
    otherSkills: ["HQL", "Tableau", "R", "Machine learning"],
  },
  {
    name: "Руководитель финансового продукта",
    mainSkills: ["Visio"],
    otherSkills: ["Python"],
  },
  {
    name: "Менеджер по маркетингу",
    mainSkills: ["Google Analytics", "Яндекс.Метрика", "Google Ads", "Ahrefs", "Главред", "My Target"],
    otherSkills: ["Tilda", "Photoshop", "Xenu", "Python"],
  },
  {
    name: "Менеджер по цифровой трансформации",
    mainSkills: ["Visio", "Google Analytics", "Яндекс.Метрика", "Python", "SQL", "Tilda"],
    otherSkills: ["Figma", "Sketch", "Shopify"],
  },
];

// Создаем уникальный список компетенций из mainSkills и otherSkills
const uniqueCompetencies = (() => {
  const allCompetencies = new Set();
  skillsData.forEach((item) => {
    item.mainSkills.forEach((skill) => allCompetencies.add(skill)); // Добавляем mainSkills
    item.otherSkills.forEach((skill) => allCompetencies.add(skill)); // Добавляем otherSkills
  });
  return Array.from(allCompetencies); // Возвращаем уникальный список компетенций
})();

function App() {
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    const chartDom = document.getElementById("main");
    const myChart = echarts.init(chartDom, null, { renderer: "canvas", useDirtyRect: true });
    setChartInstance(myChart);

    const nodes = [];
    const competencyNodes = []; // Массив узлов компетенций
    const skillNodes = []; // Массив узлов навыков
    const links = [];
    const competencyLinks = []; // Массив связей между компетенциями

    // Внешний круг с компетенциями (mainSkills и otherSkills)
    uniqueCompetencies.forEach((competency, index) => {
      const node = {
        id: `competency-${index}`, // Уникальный id для компетенции
        name: competency,
        category: "competency",
        value: 1,
        symbolSize: 65,
        itemStyle: { color: "#FFD4AD" }, // Цвет для компетенций
        x: Math.cos((index / uniqueCompetencies.length) * 2 * Math.PI) * 600, // Расположение на внешнем круге
        y: Math.sin((index / uniqueCompetencies.length) * 2 * Math.PI) * 600, // Расположение на внешнем круге
        label: {
          show: true,
          position: "inside",
          fontSize: 12,
          width: 100, // Устанавливаем максимальную ширину метки в пикселях
          overflow: "break", // Включаем автоматический перенос слов
          lineHeight: 15,
        },
      };
      competencyNodes.push(node);
      nodes.push(node); // Добавляем в общий массив узлов

      // Добавляем связь к следующей компетенции, чтобы создать круг
      const nextIndex = (index + 1) % uniqueCompetencies.length;
      const link = {
        source: `competency-${index}`,
        target: `competency-${nextIndex}`,
        lineStyle: {
          color: "#666666",
          width: 1,
        },
      };
      competencyLinks.push(link);
      links.push(link); // Также добавляем в общий массив связей
    });

    // Внутренний круг с навыками
    skillsData.forEach((skill, index) => {
      const node = {
        id: `skill-${index}`, // Уникальный id для навыка
        name: skill.name,
        category: "skill",
        value: 1,
        symbolSize: 40,
        itemStyle: { color: "#ADADAD" }, // Цвет для навыков
        x: Math.cos((index / skillsData.length) * 2 * Math.PI) * 200, // Расположение на внутреннем круге
        y: Math.sin((index / skillsData.length) * 2 * Math.PI) * 200, // Расположение на внутреннем круге
        label: {
          show: true,
          position: "inside",
          fontSize: 12,
          width: 100, // Устанавливаем максимальную ширину метки
          overflow: "break", // Включаем перенос слов
          lineHeight: 15,
        },
      };
      skillNodes.push(node);
      nodes.push(node); // Добавляем в общий массив узлов
    });

    // Установка опций графика
    myChart.setOption({
      title: {
        text: "График навыков и компетенций",
        left: "center",
      },
      series: [
        {
          type: "graph",
          layout: "none", // Управляем расположением вручную
          data: nodes, // Используем общий массив узлов
          links: links, // Используем общий массив связей
          roam: true, // Возможность перемещения
          label: {
            show: true,
            position: "inside",
            fontSize: 12,
            width: 100, // Устанавливаем максимальную ширину метки в пикселях
            overflow: "break", // Включаем автоматический перенос слов
            lineHeight: 15,
          },
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 1,
          },
          lineStyle: {
            opacity: 0.6,
            width: 2,
            curveness: 0.3,
          },
          animationDurationUpdate: 1500,
          animationEasingUpdate: "cubicOut",
        },
      ],
    });

    // Логика при клике на узел
    myChart.on("click", function (params) {
      // Сброс всех предыдущих выделений и динамических связей
      const resetNodes = nodes.map((node) => {
        let color = node.category === "competency" ? "#FFD4AD" : "#ADADAD";
        return {
          ...node,
          itemStyle: {
            ...node.itemStyle,
            color: color, // Восстанавливаем оригинальный цвет
          },
          label: {
            ...node.label,
          },
        };
      });

      // При сбросе связей оставляем связи между компетенциями
      const resetLinks = [...competencyLinks];

      myChart.setOption({
        series: [
          {
            data: resetNodes,
            links: resetLinks,
          },
        ],
      });

      // Если кликнули на навык (внутренний круг)
      if (params.data.category === "skill") {
        const clickedSkill = params.data.name;

        const newLinks = [...competencyLinks]; // Начинаем с связей между компетенциями
        const highlightedCompetencies = new Set();

        skillsData.forEach((skill, skillIndex) => {
          if (skill.name === clickedSkill) {
            // Основные компетенции
            skill.mainSkills.forEach((mainSkill) => {
              const competencyIndex = uniqueCompetencies.indexOf(mainSkill);
              if (competencyIndex !== -1) {
                newLinks.push({
                  source: `skill-${skillIndex}`,
                  target: `competency-${competencyIndex}`,
                  lineStyle: { color: "orange", width: 3 },
                });
                highlightedCompetencies.add(mainSkill);
              }
            });

            // Дополнительные компетенции
            skill.otherSkills.forEach((otherSkill) => {
              const competencyIndex = uniqueCompetencies.indexOf(otherSkill);
              if (competencyIndex !== -1) {
                newLinks.push({
                  source: `skill-${skillIndex}`,
                  target: `competency-${competencyIndex}`,
                  lineStyle: { color: "purple", width: 3 },
                });
                highlightedCompetencies.add(otherSkill);
              }
            });
          }
        });

        // Обновляем цвета узлов
        const updatedNodes = nodes.map((node) => {
          if (node.id === params.data.id) {
            return {
              ...node,
              itemStyle: {
                ...node.itemStyle,
                color: "green",
              },
            };
          } else if (highlightedCompetencies.has(node.name)) {
            return {
              ...node,
              itemStyle: {
                ...node.itemStyle,
                color: "orange",
              },
            };
          }
          return node;
        });

        // Обновляем график с новыми узлами и связями
        myChart.setOption({
          series: [
            {
              data: updatedNodes,
              links: newLinks, // Используем объединенный массив связей
            },
          ],
        });
      }

      // Если кликнули на компетенцию (внешний круг)
      if (params.data.category === "competency") {
        const clickedCompetency = params.data.name;

        const newLinks = [...competencyLinks]; // Начинаем с связей между компетенциями
        const highlightedSkills = new Set();

        skillsData.forEach((skill, skillIndex) => {
          const isMainSkill = skill.mainSkills.includes(clickedCompetency);
          const isOtherSkill = skill.otherSkills.includes(clickedCompetency);

          if (isMainSkill || isOtherSkill) {
            const lineColor = isMainSkill ? "orange" : "purple";
            newLinks.push({
              source: `skill-${skillIndex}`,
              target: `competency-${uniqueCompetencies.indexOf(clickedCompetency)}`,
              lineStyle: { color: lineColor, width: 3 },
            });
            highlightedSkills.add(skill.name);
          }
        });

        // Обновляем цвета узлов
        const updatedNodes = nodes.map((node) => {
          if (node.name === clickedCompetency) {
            return {
              ...node,
              itemStyle: {
                ...node.itemStyle,
                color: "orange",
              },
            };
          } else if (highlightedSkills.has(node.name)) {
            return {
              ...node,
              itemStyle: {
                ...node.itemStyle,
                color: "green",
              },
            };
          }
          return node;
        });

        // Обновляем график с новыми узлами и связями
        myChart.setOption({
          series: [
            {
              data: updatedNodes,
              links: newLinks, // Используем объединенный массив связей
            },
          ],
        });
      }
    });

    // Устанавливаем пассивные обработчики событий для предотвращения блокировки
    chartDom.addEventListener("wheel", (e) => e.preventDefault(), { passive: true });

    return () => {
      myChart.dispose();
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "900px" }}>
      <div id="main" style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
}

export default App;
