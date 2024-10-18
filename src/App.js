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
    item.mainSkills.forEach((skill) => allCompetencies.add(skill));
    item.otherSkills.forEach((skill) => allCompetencies.add(skill));
  });
  return Array.from(allCompetencies);
})();

function App() {
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    const chartDom = document.getElementById("main");
    const myChart = echarts.init(chartDom, null, { renderer: "canvas", useDirtyRect: true });
    setChartInstance(myChart);

    const nodes = [];
    const competencyNodes = []; // Узлы компетенций
    const skillNodes = []; // Узлы навыков
    const links = [];
    // Убрали competencyLinks, так как больше не нужны линии между компетенциями

    const innerCircleRadius = 200; // Радиус для навыков
    const outerCircleRadius = 450; // Увеличили радиус для компетенций, чтобы избежать наложений

    // Генерируем узлы компетенций (без соединительных линий)
    uniqueCompetencies.forEach((competency, index) => {
      const angle = (index / uniqueCompetencies.length) * 2 * Math.PI;
      const x = Math.cos(angle) * outerCircleRadius;
      const y = Math.sin(angle) * outerCircleRadius;

      const node = {
        id: `competency-${index}`,
        name: competency,
        category: "competency",
        value: 1,
        symbolSize: 70, // Немного увеличили размер символа для лучшей видимости
        itemStyle: { color: "#FFD4AD" },
        x: x,
        y: y,
        originalX: x,
        originalY: y,
        label: {
          show: true,
          position: "center",
          fontSize: 12,
          width: 80, // Подкорректировали ширину метки
          overflow: "break",
          lineHeight: 15,
        },
      };
      competencyNodes.push(node);
      nodes.push(node);
      // Убрали код, который добавляет линии между компетенциями
    });

    // Генерируем узлы навыков
    skillsData.forEach((skill, index) => {
      const angle = (index / skillsData.length) * 2 * Math.PI;
      const x = Math.cos(angle) * innerCircleRadius;
      const y = Math.sin(angle) * innerCircleRadius;

      const node = {
        id: `skill-${index}`,
        name: skill.name,
        category: "skill",
        value: 1,
        symbolSize: 50, // Немного увеличили размер символа для лучшей видимости
        itemStyle: { color: "#ADADAD" },
        x: x,
        y: y,
        label: {
          show: true,
          position: "center",
          fontSize: 12,
          width: 100,
          overflow: "break",
          lineHeight: 15,
        },
      };
      skillNodes.push(node);
      nodes.push(node);
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
          layout: "none",
          data: nodes,
          links: links, // Нет соединительных линий между компетенциями
          roam: true,
          label: {
            show: true,
            position: "center",
            fontSize: 12,
            width: 80,
            overflow: "break",
            lineHeight: 15,
          },
          labelLayout: function (params) {
            const node = params.data;
            if (node && node.category === "competency") {
              const angle = Math.atan2(node.y, node.x);
              const offset = 80;
              const dx = Math.cos(angle) * offset;
              const dy = Math.sin(angle) * offset;
              return {
                dx: dx,
                dy: dy,
                align: Math.abs(angle) < Math.PI / 2 ? "left" : "right",
                verticalAlign: "middle",
              };
            }
            return {};
          },
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 1,
          },
          lineStyle: {
            opacity: 0.6,
            width: 2,
            curveness: 0.0,
          },
          animationDurationUpdate: 1500,
          animationEasingUpdate: "cubicOut",
        },
      ],
    });

    // Логика при клике на узел
    myChart.on("click", function (params) {
      // Сброс предыдущих выделений и динамических связей
      const resetNodes = nodes.map((node) => {
        let color = node.category === "competency" ? "#FFD4AD" : "#ADADAD";
        return {
          ...node,
          itemStyle: {
            ...node.itemStyle,
            color: color,
          },
          label: {
            ...node.label,
          },
          // Возвращаем узлы на их исходные позиции
          x: node.category === "competency" ? node.originalX : node.x,
          y: node.category === "competency" ? node.originalY : node.y,
        };
      });

      // Так как мы убрали competencyLinks, resetLinks будет пустым
      const resetLinks = [];

      myChart.setOption({
        series: [
          {
            data: resetNodes,
            links: resetLinks,
          },
        ],
      });

      // Если кликнули на навык
      if (params.data.category === "skill") {
        const clickedSkill = params.data.name;
        const skillNode = nodes.find((node) => node.id === params.data.id);

        const newLinks = []; // Начинаем с пустого массива, так как нет связей между компетенциями
        const highlightedCompetencies = [];
        const relatedCompetencyIndices = [];

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
                highlightedCompetencies.push(mainSkill);
                relatedCompetencyIndices.push(competencyIndex);
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
                highlightedCompetencies.push(otherSkill);
                relatedCompetencyIndices.push(competencyIndex);
              }
            });
          }
        });

        // Общее количество компетенций
        const totalCompetencies = competencyNodes.length;
        const totalRelated = relatedCompetencyIndices.length;
        const totalUnrelated = totalCompetencies - totalRelated;

        // Устанавливаем минимальный угол между узлами (в радианах)
        const minAngleBetweenNodes = (20 * Math.PI) / 180; // 20 градусов

        // Вычисляем необходимый угол для каждой группы
        const requiredAngleRelated = minAngleBetweenNodes * Math.max(totalRelated - 1, 1);
        const requiredAngleUnrelated = minAngleBetweenNodes * Math.max(totalUnrelated - 1, 1);

        // Проверяем, не превышает ли сумма необходимых углов полный круг
        let totalRequiredAngle = requiredAngleRelated + requiredAngleUnrelated;
        let scaleFactor = 1;

        if (totalRequiredAngle > 2 * Math.PI) {
          // Масштабируем углы
          scaleFactor = (2 * Math.PI) / totalRequiredAngle;
        }

        // Вычисляем реальные секторы с учетом масштабирования
        const sectorAngleRelated = requiredAngleRelated * scaleFactor;
        const sectorAngleUnrelated = requiredAngleUnrelated * scaleFactor;

        // Начальный угол для связанных компетенций
        const angle = Math.atan2(skillNode.y, skillNode.x);
        const startAngleRelated = angle - sectorAngleRelated / 2;

        // Размещаем связанные компетенции
        relatedCompetencyIndices.forEach((competencyIndex, i) => {
          const competencyNode = competencyNodes[competencyIndex];
          let newAngle;
          if (totalRelated === 1) {
            newAngle = angle;
          } else {
            newAngle = startAngleRelated + (sectorAngleRelated / (totalRelated - 1)) * i;
          }
          const radius = outerCircleRadius + 50; // Увеличили радиус для большего пространства

          competencyNode.x = Math.cos(newAngle) * radius;
          competencyNode.y = Math.sin(newAngle) * radius;
        });

        // Размещаем остальные компетенции
        const unhighlightedCompetencyIndices = competencyNodes
          .map((node, index) => index)
          .filter((index) => !relatedCompetencyIndices.includes(index));

        const startAngleUnrelated = startAngleRelated + sectorAngleRelated;
        const totalUnrelatedAngles = 2 * Math.PI - sectorAngleRelated;

        unhighlightedCompetencyIndices.forEach((competencyIndex, i) => {
          const competencyNode = competencyNodes[competencyIndex];
          let newAngle;
          if (totalUnrelated === 1) {
            newAngle = angle + Math.PI;
          } else {
            newAngle = startAngleUnrelated + (totalUnrelatedAngles / totalUnrelated) * i;
          }
          const radius = outerCircleRadius;

          competencyNode.x = Math.cos(newAngle) * radius;
          competencyNode.y = Math.sin(newAngle) * radius;
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
          } else if (highlightedCompetencies.includes(node.name)) {
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
              links: newLinks,
            },
          ],
        });
      }

      // Логика при клике на компетенцию остается без изменений
      if (params.data.category === "competency") {
        // Ваша существующая логика для обработки клика по компетенции
        // Вы можете реализовать аналогичное перестроение для навыков, если необходимо
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
