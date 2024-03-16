# Utility Wind

Zero runtime and fully typed utility props support for tailwind classes.

## Introduction

Utility Wind is a library that provides zero runtime and fully typed utility props support for tailwind classes. It transpiles utility props to tailwind classes at build time, so you don't have to worry about the runtime cost of using utility props.

## Usage

```jsx
const App = () => {
  return (
    <div $flex flex={1} bg="black" items="center" justify="center">
      <button
        bg="green-500"
        rounded="md"
        text="white"
        px="5"
        py="3"
        hover={{
          bg: "green-600",
        }}
        active={{
          bg: "green-700",
        }}
        focus={{
          bg: "green-800",
        }}
        focus-visible={{
          bg: "green-900",
        }}
      >
        Hello world
      </button>
    </div>
  );
};
```
