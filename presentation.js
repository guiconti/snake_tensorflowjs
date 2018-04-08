const converter = new showdown.Converter();
const text = `# Snake AI

## [V1](v1/index.html)
Simple QLearning implementation with bad rewards and states

## [V2](v2/index.html)
Focus learning on surviving by changing states

## [V3](v3/index.html)
First real implementation with correct states and rewards, AI focusing on eating the apple now

## [V4](v4/index.html)
Changing states to be more precise using the map as a X*Y grid. At the moment there are 2,535301200456459e30 possible states for a 10x10 grid

## [V5](v5/index.html)
Implementing E Greedy policy for better exploration and exploitation

## [V6](v6/index.html)
Making the state more simple, we only need to look to the surrounds of the snake, not the whole grid. Now we have 574 possible states
`;
const htmlBody = document.getElementById("markdown");
htmlBody.innerHTML = converter.makeHtml(text);